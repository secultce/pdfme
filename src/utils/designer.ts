import {Designer} from "@pdfme/ui";
import {BLANK_A4_PDF, CommonOptions, Schema, Template, UIOptions} from "@pdfme/common";
import plugins from "../plugins/plugins.ts";
import SchemaType from "../@types/SchemaTypes.ts";

export class CustomDesigner {
    private static domID: string = "pdfme-box";

    private designer: Designer;

    private static baseTemplateOptions: Template = {
        schemas: [[]],
        basePdf: BLANK_A4_PDF,
        pdfmeVersion: "5.0.0",
        staticSchema: [
            {
                name: "pageNumber",
                type: "text",
                content: "Page {currentPage} of {totalPages}",
                position: {
                    x: 145,
                    y: 282
                },
                width: 45,
                height: 10,
                rotate: 0,
                alignment: "right",
                verticalAlignment: "middle",
                fontSize: 13,
                lineHeight: 1,
                characterSpacing: 0,
                fontColor: "#000000",
                backgroundColor: "",
                opacity: 1,
                strikethrough: false,
                underline: false,
                required: false,
                readOnly: true
            }
        ]
    }

    constructor(schema: SchemaType|undefined) {
        let domContainer = CustomDesigner.getDomContainer();
        const schem = schema?.schemas ?? [[]];

        this.designer = new Designer({
            domContainer,
            template: {
                ...CustomDesigner.baseTemplateOptions,
                schemas: schem,
            },
            plugins,
            options: {
                preventDelete: {
                    type: ['fixed-text'],
                },
            },
        });

        // this.designer.onChange((schema: Schema): void => {
        //     const currentSchemas: Schema[][] = this.designer.getTemplate().schemas;
        //     console.log(schema, this.designer.getTemplate());
        //     console.log(schema.schemas, this.designer.getTemplate().schemas);
        //
        //     currentSchemas.forEach((pageSchemas: Schema[], pageIndex: number): void => {
        //         pageSchemas.forEach((schema: Schema) => {
        //             if (
        //                 schema.type === 'fixed-text'
        //                 && !currentSchemas[pageIndex].find((s: Schema): boolean => s.name === schema.name)
        //             ) {
        //                 currentSchemas[pageIndex].push(schema);
        //             }
        //         });
        //     });
        //
        //     this.designer.updateTemplate({
        //         ...this.designer.getTemplate(),
        //         schemas: currentSchemas,
        //     });
        // });
    }

    public getDesigner(): Designer {
        if (this.designer === undefined) {
            this.recreateDesigner([]);
        }
        return this.designer;
    }

    public changeSchema(schema: SchemaType): void {
        this.recreateDesigner(schema.schemas);
    }

    private recreateDesigner(schemas: Schema[][]): void {
        const domContainer = CustomDesigner.getDomContainer();

        this.designer = new Designer({
            domContainer,
            template: {
                ...CustomDesigner.baseTemplateOptions,
                schemas: schemas,
            },
            plugins,
            options: <CommonOptions>{
                preventDelete: {
                    type: ['fixed-text'],
                },
            },
        });
    }

    private static getDomContainer(): HTMLElement {
        let domContainer = document.getElementById(CustomDesigner.domID);
        if (!domContainer) {
            domContainer = document.createElement("div");
            domContainer.setAttribute("id", CustomDesigner.domID);
            document.body.appendChild(domContainer);
        }

        return domContainer;
    }
}
