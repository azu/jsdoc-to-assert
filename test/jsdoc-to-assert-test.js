// LICENSE : MIT
"use strict";
const assert = require("power-assert");
const doctrine = require("doctrine");
const astEqual = require("ast-equal").default;
const escodegen = require("escodegen");
import Attachment from "../src/Attachment";
describe("jsdoc-to-assert", function () {
    it("should convert", function () {
        const code = `
/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
function myFunc(param, b, c){}`;
        const AST = Attachment.toASTFromCode(code);
        const result = escodegen.generate(AST, {
            comment: true
        });
        astEqual(result, `
/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
function myFunc(param, b, c){
    console.assert(typeof param === 'number');
    console.assert(typeof b === 'string');
}`);
    });
});
