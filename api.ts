import SchemaType from "./src/@types/SchemaTypes.ts";
import {Template} from "@pdfme/common";

export type TemplatesContract = {
    key: string;
    name: string;
    schemaKey: string;
    template: Template;
}

export default class Api {
    private static baseUrl = 'http://localhost:1235';

    public static async getSchemas(): Promise<SchemaType[]> {
        const response = await fetch(`${Api.baseUrl}/schemas`);
        return await response.json();
    }

    public static async getTemplates(): Promise<TemplatesContract[]> {
        const response = await fetch(`${Api.baseUrl}/templates`);
        return await response.json();
    }

    public static async saveTemplate(data: TemplatesContract): Promise<boolean> {
        const response = await fetch(`${Api.baseUrl}/templates/save`, {
            method: 'POST',
            body: JSON.stringify(data),
        });

        return response.status === 200;
    }
}
