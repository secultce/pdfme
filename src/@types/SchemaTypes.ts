import { Schema } from "@pdfme/common";

export type SchemaType = {
    key: string;
    name: string;
    schemas: Schema[][];
}

export default SchemaType;
