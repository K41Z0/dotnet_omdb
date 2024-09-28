import {IException} from "interfaces/IException";

export type Result<T, E = IException> =
    | { hasError: false; value: T }
    | { hasError: true; error: E };