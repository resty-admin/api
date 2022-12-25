import { HttpService } from "@nestjs/axios";
import type { OnModuleInit } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { firstValueFrom } from "rxjs";

type AxiosRequestConfig = any;

@Injectable()
export class ApiService implements OnModuleInit {
	private _jwt: string | undefined;

	constructor(private readonly _httpService: HttpService) {}

	onModuleInit() {
		this._httpService.axiosRef.interceptors.request.use((request) => {
			if (this._jwt) {
				request.headers.Authorization = `Bearer ${this._jwt}`;
			}

			return request;
		});
	}

	setJwt(jwt: string) {
		this._jwt = jwt;
	}

	async get<T>(url: string, config?: AxiosRequestConfig) {
		return (await firstValueFrom(this._httpService.get<T>(url, config))).data;
	}

	async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return (await firstValueFrom(this._httpService.post<T>(url, data, config))).data;
	}

	async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return (await firstValueFrom(this._httpService.put<T>(url, data, config))).data;
	}

	async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
		return (await firstValueFrom(this._httpService.patch<T>(url, data, config))).data;
	}

	async delete<T>(url: string, config?: AxiosRequestConfig) {
		return (await firstValueFrom(this._httpService.delete<T>(url, config))).data;
	}

	async request<T>(config: AxiosRequestConfig) {
		return (await firstValueFrom(this._httpService.request<T>(config))).data;
	}

	async head<T>(url: string, config?: AxiosRequestConfig) {
		return (await firstValueFrom(this._httpService.head<T>(url, config))).data;
	}
}
