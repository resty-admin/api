import type { PipeTransform } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import * as path from "path";
import * as sharp from "sharp";

@Injectable()
export class MinimizePipe implements PipeTransform<Express.Multer.File, Promise<any>> {
	async transform(image: Express.Multer.File): Promise<any> {
		const originalName = path.parse(image.originalname).name;

		image["originalname"] = `${Date.now()}-${originalName}.webp`;
		image["buffer"] = await sharp(image.buffer).resize(800).webp({ effort: 3 }).toBuffer();
		return image;
	}
}
