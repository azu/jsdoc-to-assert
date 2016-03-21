// LICENSE : MIT
"use strict";
const esprima = require("esprima");
import {AllLiteral} from "./tag/AllLiteral";
import {FunctionType} from "./tag/FunctionType";
import {NameExpression} from "./tag/NameExpression";
import {NonNullableType} from "./tag/NonNullableType";
import {NullableType} from "./tag/NullableType";
import {RecordType} from "./tag/RecordType";
import {RestType} from "./tag/RestType";
import {TypeApplication} from "./tag/TypeApplication";
import {UnionType} from "./tag/UnionType";
/**
 *
 * @param {Array<Object>} comments AST's comment nodes. it should be BlockComment
 * @returns {Array}
 */
export function createAsserts(comments) {
    if (comments == null) {
        return [];
    }
    const isNotEmpty = (tag) => typeof tag !== undefined;
    // primitive
    return comments.tags.map(createAssertFromTag).filter(isNotEmpty).map(unwrappedAST);
}
export function unwrappedAST(string) {
    return esprima.parse(string).body[0];
}
/**
 * @param tagNode tagNode is defined by doctorin
 * @return {string} return assertion code string
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
