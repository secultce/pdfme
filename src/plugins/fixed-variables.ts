import {
    PDFRenderProps,
    Plugin, PropPanelSchema,
    Schema,
} from '@pdfme/common';
import { text } from "@pdfme/schemas";

// @ts-ignore
type FixedVariables = typeof text.defaultSchema;

const fixedVariablesPlugin: Plugin<FixedVariables> = {
    ui: text.ui,
    pdf: text.pdf,
    propPanel: {
        schema: ({ options, activeSchema, i18n }) => {
            return {
                type: {
                    title: 'Static',
                    widget: 'none',
                },
                content: {
                    title: 'Conteúdo',
                    type: 'string',
                    widget: 'text',
                },
                fontSize: {
                    title: 'Tamanho da fonte',
                    type: 'number',
                },
                color: {
                    title: 'Cor',
                    type: 'string',
                    widget: 'color',
                },
                width: {
                    title: 'Largura',
                    type: 'number',
                },
                height: {
                    title: 'Altura',
                    type: 'number',
                },
                name: {
                    title: i18n('fieldName'),
                    type: 'string',
                    readOnly: true,
                    required: true,
                    // widget: 'text',
                },
            };
        },
        defaultSchema: {
            name: 'fixedVariables',
            type: 'fixed-text',
            position: {
                x: 0,
                y: 0,
            },
            width: 45,
            height: 10,
            content: 'Type something...',
            readonly: true,
        },
    },
};

export default fixedVariablesPlugin;
