// LICENSE : MIT
"use strict";
const assert = require("power-assert");

const notUse_hasInstance = {};

function createCustomTypeAssertFunction(CustomType) {
    return function(value) {
        return (
          typeof Symbol === "function" && typeof Symbol.hasInstance === "symbol" && typeof CustomType !== "undefined" && typeof CustomType[Symbol.hasInstance] === "function" ?
          CustomType[Symbol.hasInstance](value) :
          notUse_hasInstance
        );
    };
}

describe("hasInstance", function() {
    if (typeof Symbol !== "function" || typeof Symbol.hasInstance !== "symbol") {
        it.skip("Symbol.hasInstance is not supported in this environment", function() {});
        return;
    }

    context("class", function() {
        it("should work same as 'instanceof CustomType'", function() {
            class CustomType {}

            const assertFunc = createCustomTypeAssertFunction(CustomType);

            assert(assertFunc(new CustomType()) === true);
            assert(assertFunc(new Int8Array(0)) === false);
        });
    });
    context("object with [Symbol.hasInstance]", function() {
        it("should return [Symbol.hasInstance]() value", function() {
            const EvenNumber = {
                [Symbol.hasInstance](value) {
                    return value % 2 === 0;
                }
            };

            const assertFunc = createCustomTypeAssertFunction(EvenNumber);

            assert(assertFunc(100) === true);
            assert(assertFunc(101) === false);
        });
    });
    context("object without [Symbol.hasInstance]", function() {
        it("should not use [Symbol.hasInstance]()", function() {
            const assertFunc = createCustomTypeAssertFunction({});

            assert(assertFunc(100) === notUse_hasInstance);
            assert(assertFunc(200) === notUse_hasInstance);
        });
    });
});
