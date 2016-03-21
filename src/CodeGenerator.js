// LICENSE : MIT
"use strict";
/**
 * @class
 */
export default class CodeGenerator {
    /**
     * wrap assert function
     * @param {string} expression
     * @returns {string}
     */
    assert(expression) {
        if (expression.indexOf(",") > 0) {
            throw new Error("should not contain ,");
        }
        return `console.assert(${expression})`;
    }
}