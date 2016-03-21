// LICENSE : MIT
"use strict";
// @param {Function}

import CodeGenerator from "../CodeGenerator";
/**
 * @return {string}
 */
export function FunctionType(tag) {
    return CodeGenerator.assert(`typeof ${tag.name} === "function"`);
}