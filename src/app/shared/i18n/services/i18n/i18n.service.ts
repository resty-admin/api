import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { GoogleSpreadsheet } from "google-spreadsheet";

import { environment } from "../../../../../environments/environment";

@Injectable()
export class I18nService {
	async refreshLanguages() {
		const doc = new GoogleSpreadsheet(environment.googleSpreadsheetPrivateKey);

		await doc.useServiceAccountAuth({
			client_email: environment.googleSpreadsheetClientEmail,
			private_key: environment.googleSpreadsheetPrivateKey
		});

		await doc.loadInfo();

		const files = {};

		for (const [title, sheet] of Object.entries(doc.sheetsByTitle)) {
			const rows = await sheet.getRows();

			const [key, ...languages] = sheet.headerValues;

			for (const language of languages) {
				files[language] = { [title]: {} };

				for (const row of rows) {
					files[language][title] = { [row[key]]: row[language] };
				}
			}

			for (const [key, value] of Object.entries(files)) {
				fs.appendFile(`src/assets/i18n/${key}.json`, JSON.stringify(value), (err) => {
					if (err) {
						throw err;
					}
					console.log("Saved!");
				});
			}

			return;
		}
	}
}
