// LICENSE : MIT
"use strict";
/**
 * @return {string}
 */
export default class CodeGenerator {
    static assert(expression) {
        if (expression.indexOf(",") > 0) {
            throw new Error("should not contain ,");
        }
        return `console.assert(${expression})`;
    }
}