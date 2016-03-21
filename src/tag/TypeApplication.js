// LICENSE : MIT
"use strict";
// @param {Array<string>}
/**
 * @return {string|undefined}
 */
export function TypeApplication(tag, CodeGenerator) {
    const expectedType = tag.type.expression.name;
    if (expectedType === "Array") {
        return CodeGenerator.assert(`Array.isArray(${tag.name})`);
    }
}
