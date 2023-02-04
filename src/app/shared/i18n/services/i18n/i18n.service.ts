import { Injectable } from "@nestjs/common";
import { GoogleSpreadsheet } from "google-spreadsheet";

import { environment } from "../../../../../environments/environment";
import { SpacesService } from "../../../spaces";

@Injectable()
export class I18nService {
	constructor(private readonly _spacesService: SpacesService) {}

	async refreshLanguages() {
		const doc = new GoogleSpreadsheet(environment.googleSpreadsheetSheetId);

		await doc.useServiceAccountAuth({
			client_email: environment.googleSpreadsheetClientEmail,
			private_key: environment.googleSpreadsheetPrivateKey
		});

		await doc.loadInfo();

		for (const [title, sheet] of Object.entries(doc.sheetsByTitle)) {
			const rows = await sheet.getRows();

			const [key, ...languages] = sheet.headerValues;

			for (const language of languages) {
				const translates = rows.reduce(
					(translates, row) => ({
						...translates,
						[row[key]]: row[language]
					}),
					{}
				);

				await this._spacesService.uploadToS3(
					`i18n/${title}`,
					`${language}.json`,
					JSON.stringify(translates),
					"application/json"
				);
			}
		}
	}
}
