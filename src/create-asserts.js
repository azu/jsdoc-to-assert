// LICENSE : MIT
"use strict";
const esprima = require("esprima");
function unwrapToAST(string) {
    return esprima.parse(string).body[0];
}
export function createAsserts(comments) {
    if (comments == null) {
        return [];
    }
    const isNotEmpty = (tag) => typeof tag !== undefined;
    // primitive
    return comments.tags.map(createAssertFromTag).filter(isNotEmpty);
}

export function assertCodeGenerator(expression) {
    if(expression.indexOf(",") > 0) {
        throw new Error("should not contain ,");
    }
    return `console.assert(${expression})`;
}
/**
 * @param tagNode tagNode is defined by doctorin
 * Reference https://esdoc.org/tags.html#type-syntax
 * https://github.com/eslint/doctrine/blob/master/test/parse.js
 */
export function createAssertFromTag(tagNode) {
    const tagType = tagNode.type.type;
    if (tagType === "NameExpression") {
        return NameExpression(tagNode);
    } else if (tagType === "AllLiteral") {
        return AllLiteral(tagNode);
    } else if (tagType === "FunctionType") {
        return FunctionType(tagNode);
    } else if (tagType === "RecordType") {
        return RecordType(tagNode);
    } else if (tagType === "UnionType") {
        return UnionType(tagNode);
    } else if (tagType === "TypeApplication") {
        return TypeApplication(tagNode);
    } else if (tagType === "RestType") {
        return RestType(tagNode);
    } else if (tagType === "NullableType") {
        return NullableType(tagNode);
    } else if (tagType === "NonNullableType") {
        return NonNullableType(tagNode);
    }
}

function AllLiteral(tag) {
    return unwrapToAST(assertCodeGenerator(`(typeof ${tag.name} !== "undefined")`));
}
function RestType(tag) {

}
function RecordType(tag) {
    const fields = tag.type.fields;
    const isFiledType = filed => filed.type === "FieldType";
    const expression = fields.filter(isFiledType).map(field => {
        const fieldPath = `${tag.name}.${field.key}`;
        return Expression(fieldPath, field.value);
    }).join(" && ");
    return unwrapToAST(assertCodeGenerator(expression));
}
function UnionType(tag) {
    const elements = tag.type.elements;
    const expression = elements.map(element => {
        return Expression(tag.name, element);
    }).join(" || ");
    return unwrapToAST(assertCodeGenerator(expression));
}
// typeof function
function FunctionType(tag) {
    return unwrapToAST(assertCodeGenerator(`typeof ${tag.name} === "function"`));
}
function TypeApplication(tag) {
    const expectedType = tag.type.expression.name;
    if (expectedType === "Array") {
        return unwrapToAST(assertCodeGenerator(`Array.isArray(${tag.name})`));
    }
}
function NonNullableType(tag) {
    const expression = Expression(tag.name, tag.type);
    return unwrapToAST(assertCodeGenerator(expression));
}
function NullableType(tag) {
    const expression = Expression(tag.name, tag.type);
    return unwrapToAST(assertCodeGenerator(expression));
}
function NameExpression(tag) {
    const expression = Expression(tag.name, tag.type);
    return unwrapToAST(assertCodeGenerator(expression));
}
/**
 * @return {string}
 */
function Expression(tagName, typeValue) {
    if (typeValue.type && typeValue.type === "NullableType") {
        // recursion
        const otherExpression = Expression(tagName, typeValue.expression);
        return `(${tagName} === null || ${otherExpression})`;
    } else if (typeValue.type && typeValue.type === "NonNullableType") {
        // recursion
        const otherExpression = Expression(tagName, typeValue.expression);
        return `(${tagName} !== null && ${otherExpression})`;
    } else {
        const expectedType = typeofName(typeValue.name);
        if (expectedType == null) {
            const expectedName = typeValue.name;
            // nullable instanceof
            return `(
                typeof ${expectedName} === "undefined" || typeof ${tagName} instanceof ${expectedName}
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