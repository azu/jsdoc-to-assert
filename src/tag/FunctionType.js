// LICENSE : MIT
"use strict";
// @param {Function}

/**
 * @return {string}
 */
export function FunctionType(tag, CodeGenerator) {
    return CodeGenerator.assert(`typeof ${tag.name} === "function"`);
}