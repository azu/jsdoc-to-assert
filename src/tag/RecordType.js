// LICENSE : MIT
"use strict";
//  * @param {{foo: ?number, bar: string}} x - this is object param.
//  * @param {{foo, bar}} x - this is object param.
import {Expression} from "./Expression";
/**
 * @return {string}
 */
export function RecordType(tag, CodeGenerator) {
    const fields = tag.type.fields;
    const isFiledType = filed => filed.type === "FieldType";
    const expression = fields.filter(isFiledType).map(field => {
        const fieldPath = `${tag.name}.${field.key}`;
        return Expression(fieldPath, field.value);
    }).join(" && ");
    return CodeGenerator.assert(expression);
}