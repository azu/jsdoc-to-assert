// LICENSE : MIT
"use strict";
import {Expression} from "./Expression";
/**
 * @return {string}
 */
export function NameExpression(tag, CodeGenerator) {
    const expression = Expression(tag.name, tag.type);
    return CodeGenerator.assert(expression);
}
