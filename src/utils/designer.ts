import {Designer} from "@pdfme/ui";
import {BLANK_A4_PDF, Schema} from "@pdfme/common";
import plugins from "../plugins/plugins.ts";
import SchemaType from "../@types/SchemaTypes.ts";

export class CustomDesigner {
    private static domID: string = "pdfme-box";

    private designer: Designer;

    constructor(schema: SchemaType|undefined) {
        let domContainer = CustomDesigner.getDomContainer();
        const schem = schema?.schemas ?? [[]];

        this.designer = new Designer({
            domContainer,
            template: {
                schemas: schem,
                basePdf: BLANK_A4_PDF,
                pdfmeVersion: "5.0.0",
            },
            plugins,
        });
    }

    public getDesigner(): Designer {
        if (this.designer === undefined) {
            this.recreateDesigner([]);
        }
        return this.designer;
    }

    public changeSchema(schema: SchemaType): void {
        console.log(this.designer.getTemplate());
        this.recreateDesigner(schema.schemas);
    }

    private recreateDesigner(schemas: Schema[][]): void {
        const domContainer = CustomDesigner.getDomContainer();
        console.log(schemas);

        this.designer = new Designer({
            domContainer,
            template: {
                schemas: schemas,
                basePdf: BLANK_A4_PDF,
                pdfmeVersion: "5.0.0",
            },
            plugins,
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
