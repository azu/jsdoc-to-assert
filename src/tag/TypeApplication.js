// LICENSE : MIT
"use strict";
import {Expression} from "./Expression";
// @param {Array.<string>}
/**
 * @return {string|undefined}
 */
export function TypeApplication(tag, CodeGenerator) {
    const expectedType = tag.type.expression.name;
    if (expectedType === "Array") {
        const applications = tag.type.applications;
        if (applications) {
            const createGenericsAssert = () => {
                // or
                const expressions = applications.map(application => {
                    return Expression("item", application);
                });
                // Array.<String,Number>
                // => (String || Number)
                const expression = expressions.join(" || ");
                return `function(item){ return (${expression}); }`;
            };
            const expression = `${tag.name}.every(${createGenericsAssert()})`;
            return CodeGenerator.assert(`Array.isArray(${tag.name}) && ${expression}`);
        } else {
            return CodeGenerator.assert(`Array.isArray(${tag.name})`);
        }
    }
}
