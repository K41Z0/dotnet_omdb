import {CodeEnum} from "enums/CodeEnum";

export interface IException {
    code: CodeEnum;
    message: string;
}