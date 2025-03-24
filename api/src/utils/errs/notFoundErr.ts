import { BaseErr } from "./baseErr";
import { ErrTypes } from "../../types";

export class NotFoundErr extends BaseErr {
    code: number = 404;
    type: ErrTypes = ErrTypes.NOT_FOUND;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, NotFoundErr.prototype);
    }

    serializeErr() {
        return { message: this.message, type: this.type };
    }

}
