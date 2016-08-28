// LICENSE : MIT
"use strict";
import {Expression} from "./Expression";
// @param {...number} tag

/*
 {
  title: 'param',
  description: 'this is spread param.',
  type:
   { type: 'RestType',
     expression:
     {
        type: 'NameExpression', name: 'number'
     }
  },
  name: 'x' }
 */
/**
 * @param tag
 * @param CodeGenerator
 * @returns {undefined|string}
 */
export function RestType(tag, CodeGenerator) {
    const expectedType = tag.type.expression.name;
    if (tag.type.type !== "RestType") {
        return;
    }
    const expression = tag.type.expression;
    if (typeof expression === "object") {
        const createGenericsAssert = () => {
            // or
            const expectedType = Expression("item", expression);
            // Array.<String,Number>
            // => (String || Number)
            return `function(item){ return (${expectedType}); }`;
        };
        const expressionString = `${tag.name}.every(${createGenericsAssert()})`;
        return CodeGenerator.assert(`Array.isArray(${tag.name}) && ${expressionString}`);
    }
}