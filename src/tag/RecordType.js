// LICENSE : MIT
"use strict";
//  * @param {{foo: ?number, bar: string}} x - this is object param.
import CodeGenerator from "../CodeGenerator";
import {Expression} from "./Expression";
export function RecordType(tag) {
    const fields = tag.type.fields;
    const isFiledType = filed => filed.type === "FieldType";
    const expression = fields.filter(isFiledType).map(field => {
        const fieldPath = `${tag.name}.${field.key}`;
        return Expression(fieldPath, field.value);
    }).join(" && ");
    return CodeGenerator.assert(expression);
}