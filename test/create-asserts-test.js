// LICENSE : MIT
"use strict";
const assert = require("power-assert");
const esprima = require("esprima");
const doctrine = require("doctrine");
const astEqual = require("ast-equal").default;
import AssertGenerator from "../src/AssertGenerator";
const {createAsserts, createAssertFromTag, createAssertFromTypeTag} = AssertGenerator;
import TestGenerator from "./helper/TestCodeGenerator";
function parse(commentValue) {
    return doctrine.parse(commentValue, {unwrap: true});
}


function pickTag(commentValue) {
    const results = parse(commentValue);
    console.assert(results != null);
    console.assert(results.tags.length > 0);
    return results.tags[0];
}
function createAssertion(jsdoc) {
    return createAssertFromTag(pickTag(jsdoc), TestGenerator);
}

function createAssertionTypeNode(name, jsdoc) {
    return createAssertFromTypeTag(name, pickTag(jsdoc), TestGenerator);
}

describe("create-assert", function() {
    describe("#createAssertFromTypeTag", function() {
        context("when correct type", function() {
            it("should return assertion string", function() {
                const result = createAssertionTypeNode("value", `/**
* @type {string}
*/`);
                assert(typeof result === "string");
                assert.equal(result, `typeof value === "string"`);
            });
        });
        context("when pass null", function() {
            it("should return []", function() {
                const result = createAssertFromTypeTag();
                assert(result === undefined);
            });
        });
    });
    context("when pass null", function() {
        it("should return []", function() {
            const results = createAsserts(null);
            console.assert(Array.isArray(results));
            console.assert(results.length === 0);
        });
    });
    context("when pass multiple param", function() {
        it("should not throw error", function() {
            const jsdoc = `/**
 * matchAll function inspired String.prototype.matchAll
 * @param {string} text
 * @param {RegExp} regExp
 * @returns {MatchAllGroup[]}
 * @see reference https://github.com/tc39/String.prototype.matchAll
 */`;
            const assertions = createAsserts(parse(jsdoc));
            assert(assertions.length, 2);
        });
        it("should not contain line break in each assertions", function() {
            const jsdoc = `/**
 * matchAll function inspired String.prototype.matchAll
 * @param {string} text
 * @param {RegExp} regExp
 * @param {{
    
 foo: String 
 
 }} obj
 * @returns {MatchAllGroup[]}
 * @see reference https://github.com/tc39/String.prototype.matchAll
 */`;
            const assertions = createAsserts(parse(jsdoc));
            assertions.forEach(assertion => {
                try {
                    esprima.parse(assertion);
                } catch (error) {
                    console.log(assertion);
                    throw error;
                }
            });
        });
    });
    context("when pass no-typed param", function() {
        it("should ignore ", function() {

            const jsdoc = `/**
 * @param x
 */`;
            const assertion = createAssertion(jsdoc);
            assert(assertion == null);
        });
    });
    context("when pass @return", function() {
        it("should ignore ", function() {

            const jsdoc = `/**
 * @returns {Array}
 */`;
            const assertion = createAssertion(jsdoc);
            assert(assertion == null);
        });
    });
    context("when pass jsdoc", function() {
        it("should return array", function() {
            const jsdoc = `
/**
 * Adds three numbers.
 *
 * @param {number} x First number.
 */
`;
            const results = createAsserts(parse(jsdoc));
            console.assert(Array.isArray(results));
            console.assert(results.length === 1);
        });
    });
    context("when pass primitive type", function() {
        it("should return assert typeof number", function() {
            const jsdoc = `/**
 * @param {number} x
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x === "number"`);
        });
        it("should return assert typeof string", function() {
            const jsdoc = `/**
 * @param {string} x
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x === "string"`);
        });
        it("should return assert typeof boolean", function() {
            const jsdoc = `/**
 * @param {boolean} x
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x === "boolean"`);
        });
        it("should return assert typeof function", function() {
            const jsdoc = `/**
 * @param {Function} x
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x === "function"`);
        });
        it("should return assert typeof function", function() {
            const jsdoc = `/**
 * @param {function} x
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x === "function"`);
        });
        it("should return assert typeof object", function() {
            const jsdoc = `/**
 * @param {Object} x
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x === "object"`);
        });
    });
    context("When pass all type", function() {
        it("should return assert AllLiteral ", function() {
            const jsdoc = `/**
 * @param {*} x - this is ArrayType param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x !== "undefined"`);
        });
    });
    context("when pass RegExp", function() {

        it("should return assert typeof nullable", function() {
            const jsdoc = `/**
 * @param {RegExp} x - this is RegExp.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `
                typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol" && typeof RegExp !== "undefined" && typeof RegExp[Symbol.hasInstance] === "function" ?
                RegExp[Symbol.hasInstance](x) :
                typeof RegExp === 'undefined' || typeof RegExp !== 'function' || x instanceof RegExp
            `);
        });
    });
    context("when pass Custom Object", function() {
        it("should return assert typeof nullable", function() {
            const A = {};
            const jsdoc = `/**
 * @param {CustomType} x - this is ArrayType param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `
                typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol" && typeof CustomType !== "undefined" && typeof CustomType[Symbol.hasInstance] === "function" ?
                CustomType[Symbol.hasInstance](x) :
                typeof CustomType === 'undefined' || typeof CustomType !== 'function' || x instanceof CustomType
            `);
        });
    });
    context("when pass Object.Property type", function() {
        it("should return assert typeof nullable", function() {
            const A = {};
            const jsdoc = `/**
 * @param {Object.Property} x - this is ArrayType param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, "true");
        });
    });
    context("when pass Array only", function() {
        it("should return Array.isArray(x)", function() {
            const jsdoc = `/**
 * @param {Array} x - this is ArrayType param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `Array.isArray(x)`);
        });
    });
    context("when pass *[]", function() {
        it("should return Array.isArray(x)", function() {
            const jsdoc = `/**
 * @param {*[]} x
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `Array.isArray(x) && x.every(function (item) {
    return typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol" && typeof undefined !== "undefined" && typeof undefined[Symbol.hasInstance] === "function" ?
        undefined[Symbol.hasInstance](item) :
        typeof undefined === 'undefined' || typeof undefined !== 'function' || item instanceof undefined;
});`);
        });
    });
    context("when pass number[]", function() {
        it("should return Array.isArray(array) && check every type", function() {
            const jsdoc = `/**
 * @param {number[]} x - this is ArrayType param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `Array.isArray(x) && x.every(function (item) {
    return typeof item === 'number';
});`);
        });
    });
    context("when pass CustomType[]", function() {
        it("should return Array.isArray(array) && check every type", function() {
            const jsdoc = `/**
 * @param {CustomType[]} x - this is ArrayType param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `Array.isArray(x) && x.every(function (item) {
    return typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol" && typeof CustomType !== "undefined" && typeof CustomType[Symbol.hasInstance] === "function" ?
        CustomType[Symbol.hasInstance](item) :
        typeof CustomType === 'undefined' || typeof CustomType !== 'function' || item instanceof CustomType;
});`);
        });
    });
    context("when pass nullable", function() {
        it("should return assert typeof nullable", function() {
            const jsdoc = `/**
 * @param {?number} x - this is nullable param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `(x == null || typeof x === "number")`);
        });
    });
    context("when pass NonNullableType", function() {
        it("should return assert typeof NonNullableType", function() {
            const jsdoc = `/**
 * @param {!number} x - this is non-nullable param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `(x != null && typeof x === "number")`);
        });
    });
    context("when pass callback function", function() {
        it("should return assert typeof funtion", function() {
            const jsdoc = `/**
 * @param {function(foo: number, bar: string): boolean} x - this is function param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x === "function"`);
        });

    });
    context("when pass optional primitive?", function() {
        // ignore
    });
    context("when pass union type", function() {
        it("should return assert expression", function() {
            const jsdoc = `/**
 * @param {number|string} x - this is union param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `(typeof x === "number" || typeof x === "string")`);
        });
    });
    context("when pass ...number", function() {
        it("should return Array.isArray(param) && check every type", function() {
            const jsdoc = `
/**
 * @param {...number} x - this is spread param.
 */`;

            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `Array.isArray(x) && x.every(function (item) {
    return typeof item === 'number';
})`);
        });
    });
    context("when pass RecordType", function() {
        it("should assert multiple types ", function() {
            const jsdoc = `/**
* @param {{SubscriptionId,Data}} data
*/`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof data !== 'undefined' && typeof data.SubscriptionId !== 'undefined' && typeof data.Data !== 'undefined';`);
        });
        it("should assert foo.bar as NullableType ", function() {
            const jsdoc = `/**
 * @param {{foo: ?number, bar: string}} x - this is object param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x !== 'undefined' && (x.foo == null || typeof x.foo === 'number') && typeof x.bar === 'string';`);
        });
        it("should return assert foo field with &&", function() {
            const jsdoc = `/**
 * @param {{foo: number, bar: string}} x - this is object param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x !== 'undefined' && typeof x.foo === 'number' && typeof x.bar === 'string';`);
        });
        it("should return assert Custom field with &&", function() {
            const jsdoc = `/**
 * @param {{foo: number, bar: RegExp}} x - this is object param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x !== 'undefined' && typeof x.foo === 'number' && (typeof Symbol === 'function' && typeof Symbol.hasInstance === 'symbol' && typeof RegExp !== 'undefined' && typeof RegExp[Symbol.hasInstance] === 'function' ? RegExp[Symbol.hasInstance](x.bar) : typeof RegExp === 'undefined' || typeof RegExp !== 'function' || x.bar instanceof RegExp);`);
        });
    });
    context("When pass Array.<string>", function() {
        it("should return Array.isArray(x) && check every type", function() {
            const jsdoc = `/**
 * @param {Array.<string>} x - this is Array param.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `Array.isArray(x) && x.every(function (item) {
    return typeof item === 'string';
});`);
        });
    });
    context("When pass Object<string, number>", function() {
        it("should check object itself and every object value", function() {
            const jsdoc = `/**
 * @param {Object<string, number>} x - this is Object param with string keys and number values.
 */`;
            const assertion = createAssertion(jsdoc);
            astEqual(assertion, `typeof x === 'object' && Object.keys(x).every(function (key) {
    return typeof x[key]  === 'number';
});`);
        });
    });
});