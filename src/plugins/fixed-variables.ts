import {Plugin, Schema} from '@pdfme/common';

interface FixedVariables extends Schema {}

const FIXED_VARIABLES = ['name', 'email', 'dateOfBirth'];

// Prevents type from being changed
const fixedSchemaValidator = (schemas: Schema[]) => {
    schemas.forEach((schema) => {
        if (!FIXED_VARIABLES.includes(schema.name)) {
            throw new Error(`Only predefined variables allowed: ${FIXED_VARIABLES.join(', ')}`);
        }
    });
};

const fixedVariablesPlugin: Plugin<Schema> = {
    pdfmeSchema: {
        text: {
            defaultSchema: {
                fontSize: 12,
                color: '#000000',
                alignment: 'left',
                key: 'name', // default variable
                type: 'text',
            },
            panel: {
                disabled: ['key', 'type'], // disables editing name/type in the UI
            },
        },
    },
    viewer: {},
    designer: {
        onAddSchema: async (schema) => {
            if (!FIXED_VARIABLES.includes(schema.key)) {
                throw new Error(`Variable "${schema.key}" is not allowed.`);
            }
        },
    },
    form: {
        schemaValidation: fixedSchemaValidator,
    },
};

export default fixedVariablesPlugin;
