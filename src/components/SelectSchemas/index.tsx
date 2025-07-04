import { ChangeEvent, useEffect, useState } from "react";
import Api from "../../../api.ts";
import SchemaType from "../../@types/SchemaTypes.ts";
import { CustomDesigner } from "../../utils/designer.ts";
import Swal from "sweetalert2";

interface SelectSchemasProps {
    designer: CustomDesigner,
    identifier: string,
    onChooseHandler: (value: (((prevState: string) => string) | string)) => void
}

export default function SelectSchemas({designer, identifier, onChooseHandler}: SelectSchemasProps) {
    const [schemas, setSchemas] = useState<SchemaType[]>([]);

    useEffect(() => {
            Api.getSchemas()
                .then((schemas: SchemaType[]) => setSchemas(schemas))
                .catch((err: Error) => {
                    Swal.fire({
                        title: err.message,
                        text: 'Não foi possível obter modelos de dados de relatórios salvos.',
                        toast: true,
                    });
                });
    }, []);

    const onChangeHandler = async (evt: ChangeEvent<HTMLSelectElement>) => {
        const schemaKey = evt.target.value;
        const schema = schemas.find((schema: SchemaType): boolean => schema.key === schemaKey);

        if (schema) {
            designer.changeSchema(schema);
        }

        onChooseHandler(schemaKey);
    }

    return (
        <span className="mx-4">
            <label htmlFor={identifier}>Selecionar relatório: </label>
            <select id={identifier} className="form-control" onChange={onChangeHandler}>
                {schemas.map((schema: SchemaType) => {
                    return (
                        <option key={schema.key} value={schema.key}>{schema.name}</option>
                    )
                })}
            </select>
        </span>
    );
}
