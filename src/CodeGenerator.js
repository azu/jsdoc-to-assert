// LICENSE : MIT
"use strict";
export default class CodeGenerator {
    /**
     * wrap assert function
     * @param {string} expression
     * @returns {string}
     */
    static assert(expression) {
        if (expression.indexOf(",") > 0) {
            throw new Error("should not contain ,");
        }
        return `console.assert(${expression})`;
    }
}