// LICENSE : MIT
"use strict";
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
        const trimmedExpression = expression.trim();
        const noSpaceExpression = trimmedExpression.replace(/\n/g, "\\n");
        return `console.assert(${trimmedExpression},'${noSpaceExpression}');`;
    }
}