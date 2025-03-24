import { ErrTypes } from "../../types";

export abstract class BaseErr extends Error {
    abstract code: number;
    abstract type: ErrTypes;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, BaseErr.prototype);
    }

    abstract serializeErr(): { message: string; type: ErrTypes; field?: string, data?: object };
}