// LICENSE : MIT
"use strict";
const assert = require("power-assert");
import {parse} from "babylon";
import traverse from "babel-traverse";
import generate from "babel-generator";
import template from "babel-template";
import Attachment from "../src/Attachment";
describe("with babel", function () {
    it("should convert string", function () {
        const code = `
/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
function myFunc(param, b, c){}
`;

        const AST = parse(code);
        const MyVisitor = {
            FunctionDeclaration(path) {
                const node = path.node;
                if (node.leadingComments && node.leadingComments.length === 1) {
                    const comment = node.leadingComments[0];
                    if (comment.type === 'CommentBlock') {
                        const functionDeclarationString = Attachment.FunctionDeclarationString(comment);
                        const buildAssert = template(functionDeclarationString)();
                        path.get("body").unshiftContainer("body", buildAssert);
                    }
                }
            }
        };

        traverse(AST, {
            enter(path) {
                path.traverse(MyVisitor);
            }
        });


        const result = generate(AST, {}, code);
        assert.equal(result.code, `
/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
function myFunc(param, b, c) {
  console.assert(typeof param === 'number');
  console.assert(typeof b === 'string');
}`);
    });
});
