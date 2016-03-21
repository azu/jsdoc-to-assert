// LICENSE : MIT
"use strict";
// @param {string|number} x
import {Expression} from "./Expression";
/**
 * @return {string}
 */
export function UnionType(tag, CodeGenerator) {
    const elements = tag.type.elements;
    const expression = elements.map(element => {
        return Expression(tag.name, element);
    }).join(" || ");
    return CodeGenerator.assert(expression);
}
