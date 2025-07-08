import {ChangeEvent, JSX, useEffect, useState} from "react";
import Api from "../../../api.ts";
import SchemaType from "../../@types/SchemaTypes.ts";
import { CustomDesigner } from "../../utils/designer.ts";
import Toast from "../../utils/swal-toast.ts";

interface SelectSchemasProps {
    designer: CustomDesigner,
    identifier: string,
    onChooseHandler: (schema: SchemaType) => void,
}

export default function SelectSchemas({designer, identifier, onChooseHandler}: SelectSchemasProps) {
    const [schemas, setSchemas] = useState<SchemaType[]>([]);

    useEffect((): void => {
        Api.getSchemas()
            .then((schemasTypes: SchemaType[]) => {
                setSchemas(schemasTypes);
                designer.changeSchema(schemasTypes[0]);
            })
            .catch((err: Error): void => {
                Toast.fire({
                    icon: "error",
                    title: err.message,
                    text: 'Não foi possível obter modelos de dados de relatórios salvos.',
                });
            });
    }, []);

    const onChangeHandler = async (evt: ChangeEvent<HTMLSelectElement>): Promise<void> => {
        const schemaKey = evt.target.value;
        const schema = schemas.find((s: SchemaType): boolean => s.key === schemaKey);

        if (schema) {
            designer.changeSchema(schema);
            onChooseHandler(schema);
        }
    }

    return (
        <span className="mx-4">
            <label htmlFor={identifier}>Selecionar relatório: </label>
            <select id={identifier} className="form-control" onChange={onChangeHandler}>
                {schemas.map((schema: SchemaType): JSX.Element => (
                    <option key={schema.key} value={schema.key}>{schema.name}</option>
                ))}
            </select>
        </span>
    );
}
