import { ChangeEvent, useEffect, useState } from "react";
import Swal from "sweetalert2";
import Api, { type TemplatesContract } from "../../../api.ts";
import { CustomDesigner } from "../../utils/designer.ts";

interface SelectTemplatesProps {
    designer: CustomDesigner,
    identifier: string,
    onChooseHandler: (key: string, name: string) => void
}

export default function SelectTemplates({designer, identifier, onChooseHandler}: SelectTemplatesProps) {
    const [templates, setTemplates] = useState<TemplatesContract[]>([]);

    useEffect(() => {
        Api.getTemplates()
            .then((templatesResponse: TemplatesContract[]) => setTemplates(templatesResponse))
            .catch((err: Error) => {
                Swal.fire({
                    title: err.message,
                    text: 'Não foi possível obter templates salvos.',
                    toast: true,
                });
            });
    }, []);

    const onChangeHandler = async (evt: ChangeEvent<HTMLSelectElement>) => {
        const currentValue = evt.target.value;

        if (currentValue === 'new') {
            onChooseHandler(currentValue, '');

            return;
        }

        const template = templates.find((templ: TemplatesContract): boolean => templ.key === currentValue);

        if (template) {
            onChooseHandler(currentValue, template.name);

            designer.changeSchema({
                key: template.schemaKey,
                name: '',//template.name,
                schemas: template.template.schemas,
            });
        }
    }

    return (
        <span className="mx-4">
            <label htmlFor={identifier}>Selecionar template: </label>
            <select id={identifier} className="form-control" onChange={onChangeHandler}>
                <option value="new">➕ Novo templare</option>
                {templates.map((template) => {
                    return (
                        <option key={template.key} value={template.key}>📜 {template.name}</option>
                    )
                })}
            </select>
        </span>
    );
}
