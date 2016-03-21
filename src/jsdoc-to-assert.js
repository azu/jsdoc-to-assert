// LICENSE : MIT
"use strict";
const esprima = require('esprima');
const estraverse = require('estraverse');
const escodegen = require("escodegen");
const doctrine = require('doctrine');
import {createAsserts} from "./create-asserts"
/**
 * FunctionDeclaration to FunctionDeclaration
 * This is mutable function.
 * @param node
 * @param comment
 * @returns {Object}
 */
export function FunctionDeclaration(node, comment) {
    /*
     TODO: sloppy is not support
     It mean that optional param just ignored.
     */
    const commentData = doctrine.parse(comment.value, {unwrap: true});
    const assertsAST = createAsserts(commentData);
    const body = node.body.body;
    body.unshift(...assertsAST);
    return node;
}
export function FunctionDeclarationString(comment) {
    var commentData = doctrine.parse(comment.value, {unwrap: true});
    var assertsAST = createAsserts(commentData);
    return escodegen.generate({
        type: esprima.Syntax.Program,
        body: assertsAST
    });
}

function replaceWalk(node) {
    switch (node.type) {
        case esprima.Syntax.FunctionDeclaration:
            if (node.leadingComments && node.leadingComments.length === 1) {
                const comment = node.leadingComments[0];
                if (comment.type === 'Block') {
                    return FunctionDeclaration(node, comment);
                }
            }
            break;
        default:
            break;
    }
}

/**
 * AST to AST
 * @param {Object} AST
 * @returns {Object}
 */
export function rewriteAST(AST) {
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
export function toAST(content) {
    var tree = esprima.parse(content.toString(), {attachComment: true, loc: true});
    return rewriteAST(tree);
}