import { BaseErr } from "./baseErr";
import { ErrTypes } from "../../types";

export class RequestValidationErr extends BaseErr {
    code = 400;
    type: ErrTypes = ErrTypes.VALIDATION_ERROR;

    constructor(public message: string, public field: string) {
        super(message);
        Object.setPrototypeOf(this, RequestValidationErr.prototype);
    }

    serializeErr() {
        return {
            message: this.message,
            type: this.type,
            field: this.field
        }
    }

}