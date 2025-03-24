import { ErrTypes } from "../../types";
import { BaseErr } from "./baseErr";

export class UnauthorizedErr extends BaseErr {
    code = 401;
    type: ErrTypes = ErrTypes.UNAUTHORIZED;

    constructor(public message: string) {
        super(message);
        Object.setPrototypeOf(this, UnauthorizedErr.prototype);
    }

    serializeErr() {
        return {
            message: this.message,
            type: this.type
        }
    }

}