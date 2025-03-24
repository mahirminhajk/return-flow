import { BaseErr } from "./baseErr";
import { ErrTypes } from "../../types";

export class BadRequestErr extends BaseErr {
    code = 400;

    constructor(public message: string, public type: ErrTypes) {
        super(message);
        Object.setPrototypeOf(this, BadRequestErr.prototype);
    }

    serializeErr() {
        return {
            message: this.message,
            type: this.type
        }
    }

}