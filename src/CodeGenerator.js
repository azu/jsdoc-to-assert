// LICENSE : MIT
"use strict";
function trimSpaceEachLine(text) {
    return text
        .split("\n")
        .filter(line => line != null)
        .map(line => line.trim())
        .join("\n");
}
export default class CodeGenerator {
    /**
     * @param commentTagNode commentTagNode is doctrine tag node
     */
    constructor(commentTagNode) {
    }

    /**
     * wrap assert function
     * @param {string} expression
     * @returns {string}
     */
    assert(expression) {
        if (expression.indexOf(",") > 0) {
            throw new Error("should not contain ,");
        }
        // TODO: more safe using AST?
        const trimmedExpression = trimSpaceEachLine(expression);
        const noSpaceExpression = trimmedExpression.replace(/\n/g, "\\n");
        return `if(${trimmedExpression}){ throw new TypeError('Invalid JSDoc @param: ${noSpaceExpression}'); }`;
    }
}