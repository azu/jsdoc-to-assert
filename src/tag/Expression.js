// LICENSE : MIT
"use strict";
/**
 * @return {string}
 */
export function Expression(tagName, typeValue) {
    if (typeValue.type && typeValue.type === "NullableType") {
        // recursion
        const otherExpression = Expression(tagName, typeValue.expression);
        return `(${tagName} == null || ${otherExpression})`;
    } else if (typeValue.type && typeValue.type === "NonNullableType") {
        // recursion
        const otherExpression = Expression(tagName, typeValue.expression);
        return `(${tagName} != null && ${otherExpression})`;
    } else {
        const expectedType = typeofName(typeValue.name);
        if (expectedType == null) {
            const expectedName = typeValue.name;
            // if right-hand is undefined, return true
            // if right-hand is not function, return true
            // if right-hand is function && left instanceof right
            return `(
                typeof ${expectedName} === "undefined" || typeof ${expectedName} !== "function" || ${tagName} instanceof ${expectedName}
             )`;
        } else {
            return `typeof ${tagName} === "${expectedType}"`;
        }
    }
}
// typeof
export function typeofName(nodeTypeName) {
    switch (nodeTypeName) {
        case "Object":
        case "object":
            return "object";
        case "Function":
            return "function";
        case "string":
        case "String":
            return "string";
        case "number":
        case "Number":
            return "number";
        case "boolean":
        case "Boolean":
            return "boolean";
        case "undefined":
            return "undefined";
        case "Symbol":
        case "symbol":
            return "symbol";
        default:
            return;
    }
}