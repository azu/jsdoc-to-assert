// LICENSE : MIT
"use strict";
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require("escodegen");
const doctrine = require('doctrine');
import AssertGenerator from "./AssertGenerator"
export default class Attachment {

    /**
     * FunctionDeclaration to FunctionDeclaration
     * This is mutable function.
     * @param node
     * @param comment
     * @returns {Object}
     */
    static FunctionDeclaration(node, comment) {
        /*
         TODO: sloppy is not support
         It mean that optional param just ignored.
         */
        const commentData = doctrine.parse(comment.value, {unwrap: true});
        const assertsAST = AssertGenerator.createAsserts(commentData);
        const body = node.body.body;
        body.unshift(...assertsAST);
        return node;
    }

    /**
     * @param {Array<Object>} comment
     * @returns {string}
     */
    static FunctionDeclarationString(comment) {
        var commentData = doctrine.parse(comment.value, {unwrap: true});
        var assertsAST = AssertGenerator.createAsserts(commentData);
        return escodegen.generate({
            type: esprima.Syntax.Program,
            body: assertsAST
        });
    }


    /**
     * AST to AST
     * mutable function
     * @param {Object} AST
     * @returns {Object}
     */
    static toASTFromAST(AST) {
        const replaceWalk = function replaceWalk(node) {
            switch (node.type) {
                case esprima.Syntax.FunctionDeclaration:
                    if (node.leadingComments && node.leadingComments.length === 1) {
                        const comment = node.leadingComments[0];
                        if (comment.type === 'Block') {
                            return Attachment.FunctionDeclaration(node, comment);
                        }
                    }
                    break;
                default:
                    break;
            }
        };
        return estraverse.replace(AST, {
            enter: function (node) {
                const r = replaceWalk(node);
                if (r) {
                    return r;
                }
            }
        });
    }

    /**
     * Code to AST
     * @param {string} content
     */
    static toASTFromCode(content) {
        const tree = esprima.parse(content.toString(), {attachComment: true, loc: true});
        return Attachment.toASTFromAST(tree);
    }
}