// LICENSE : MIT
"use strict";
import {Expression} from "./Expression";
/**
 * @return {string}
 */
export function NullableType(tag, CodeGenerator) {
    const expression = Expression(tag.name, tag.type);
    return CodeGenerator.assert(expression);
}
