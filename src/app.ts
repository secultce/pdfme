// import * as bootstrap from 'bootstrap'
import { BLANK_A4_PDF, DesignerProps, Schema, Template } from '@pdfme/common';
import { Designer } from '@pdfme/ui';
import plugins from "./plugins/plugins";

async function getSchemas(): Promise<any> {
    return await (await fetch('http://localhost:1235/schemas')).json();
}

const BTN_SAVE_TEMPLATE: HTMLElement | null = document.getElementById('save-template');
const SELECT_SCHEMAS = <HTMLSelectElement>document.getElementById('schemas');

const template: Template = {
    schemas: [[]],
    basePdf: BLANK_A4_PDF,
    pdfmeVersion: "5.0.0",
};

const domContainer =  document.getElementById('pdfme-box');

let designer = new Designer(<DesignerProps>{
    domContainer,
    template,
    plugins,
});

BTN_SAVE_TEMPLATE?.addEventListener('click', () => {
    const template: Template = designer.getTemplate();

    alert(JSON.stringify(template));
});


SELECT_SCHEMAS.addEventListener('change', async (): Promise<void> => {
    const schemasData = await (await getSchemas()).json();
    const schema = schemasData.find((schema: Schema): boolean => schema.key === SELECT_SCHEMAS.value);

    designer = new Designer(<DesignerProps>{
        domContainer,
        template: {...template, schemas: schema.schema},
        plugins,
    });
});
