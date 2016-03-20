// LICENSE : MIT
"use strict";
const assert = require("power-assert");
const doctrine = require("doctrine");
const astEqual = require("ast-equal").default;
const esprima = require("esprima");
const escodegen = require("escodegen");
import {toAST} from "../src/jsdoc-to-assert";
it("should convert", function () {
    const code = `
/**
 * @param {number} param - this is a param.
 * @param {string} b - this is a param.
 * @param {string[]} [c] - this is a param.
 */
function myFunc(param, b, c){}`;
    const AST = toAST(code);
    const result = escodegen.generate(AST, {
        comment: true
    });
    console.log(result);
});