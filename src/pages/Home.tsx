import { useState } from "react";
import { Template } from "@pdfme/common";
import Swal from "sweetalert2";
import Api from "../../api.ts";
import SchemaType from "../@types/SchemaTypes.ts";
import SelectSchemas from "../components/SelectSchemas";
import SelectTemplates from "../components/SelectTemplates";
import { CustomDesigner } from "../utils/designer.ts";

export default function Home() {
    const [designer] = useState(() => new CustomDesigner({} as SchemaType));
    const [selectedSchema, setSelectedSchema] = useState<SchemaType | null>(null);
    const [templateKey, setTemplateKey] = useState<string>('new');
    const [templateName, setTemplateName] = useState<string>('');

    async function saveTemplateHandler() {
        const template: Template = designer.getDesigner()?.getTemplate();

        if (!template || !selectedSchema?.key || !templateKey) {
            return;
        }

        let newTemplateInputOptions = {};
        if (templateKey === 'new') {
            newTemplateInputOptions = {
                input: 'text',
                inputLabel: 'Informe o nome do novo template: ',
                text: 'Salvar novo template?',
            };
        }

        const confirmSave = await Swal.fire({
            text: `Salvar template "${templateName}"?`,
            confirmButtonText: 'Confirmar',
            cancelButtonText: 'Cancelar',
            showCancelButton: true,
            showLoaderOnConfirm: true,
            ...newTemplateInputOptions,
        });

        if (!confirmSave.isConfirmed) {
            return;
        }

        let newName = null, newKey = null;
        if (typeof confirmSave.value === 'string') {
            newName = confirmSave.value;
            newKey = newName.trim().replace(' ', '-');
        }

        const data = {
            template,
            schemaKey: selectedSchema?.key,
            name: newName ?? templateName,
            key: newKey ?? templateKey,
        };

        const saved = await Api.saveTemplate(data);

        if (saved) {
            Swal.fire({
                title: 'Salvo com sucesso!',
                icon: 'success',
                toast: true,
            });
        } else {
            Swal.fire({
                title: 'Erro',
                text: 'Erro ao salvar template',
                icon: 'error',
                toast: true,
            });
        }
    }

    function onChooseSchemaHandler(schema: SchemaType) {
        setSelectedSchema(schema);
    }

    function onChooseTemplateHandler(key: string, name: string = 'new'): void {
        setTemplateKey(key);
        setTemplateName(name);

        if ('new' === key) {
            designer.changeSchema(selectedSchema as SchemaType);
        }
    }

    return (
        <>
            <header>
                <h1>Criador de templates</h1>
                <div className="btn-group">
                    <SelectSchemas designer={designer} onChooseHandler={onChooseSchemaHandler} identifier="schemas" />
                    <SelectTemplates designer={designer} onChooseHandler={onChooseTemplateHandler} identifier="templates" />
                    <button
                        type="button"
                        id="save-template"
                        className="btn btn-primary mx-4"
                        onClick={saveTemplateHandler}
                    >Salvar Template</button>
                </div>
            </header>
        </>
    );
}
