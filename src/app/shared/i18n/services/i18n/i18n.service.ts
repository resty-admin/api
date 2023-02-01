import type { OnModuleInit } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import * as fs from "fs";
import { GoogleSpreadsheet } from "google-spreadsheet";

import { environment } from "../../../../../environments/environment";

@Injectable()
export class I18nService implements OnModuleInit {
	onModuleInit() {
		// this.refreshLanguages().then();
	}

	async refreshLanguages() {
		const doc = new GoogleSpreadsheet(environment.googleSpreadsheetSheetId);

		await doc.useServiceAccountAuth({
			client_email: environment.googleSpreadsheetClientEmail,
			private_key: environment.googleSpreadsheetPrivateKey
		});

		await doc.loadInfo();

		for (const [title, sheet] of Object.entries(doc.sheetsByTitle)) {
			const files = {};

			const rows = await sheet.getRows();

			const [key, ...languages] = sheet.headerValues;

			for (const language of languages) {
				for (const row of rows) {
					files[language] = {
						...(files[language] || {}),
						[row[key]]: row[language]
					};
				}
			}

			for (const [language, translates] of Object.entries(files)) {
				const dir = `src/assets/i18n/${title}`;

				if (!fs.existsSync(dir)) {
					fs.mkdirSync(dir);
				}

				fs.appendFile(`${dir}/${language}.json`, JSON.stringify(translates), (err) => {
					if (err) {
						throw err;
					}
					console.log("Saved!");
				});
			}
		}

		
	}
}
