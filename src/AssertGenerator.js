// LICENSE : MIT
"use strict";
import {AllLiteral} from "./tag/AllLiteral";
import {FunctionType} from "./tag/FunctionType";
import {NameExpression} from "./tag/NameExpression";
import {NonNullableType} from "./tag/NonNullableType";
import {NullableType} from "./tag/NullableType";
import {RecordType} from "./tag/RecordType";
import {RestType} from "./tag/RestType";
import {TypeApplication} from "./tag/TypeApplication";
import {UnionType} from "./tag/UnionType";
import CodeGenerator from "./CodeGenerator";
// default code generator
const codeGenerator = new CodeGenerator();
/**
 * @typedef {Object} AssertGeneratorOptions
 * @property {Function} generator
 */
const defaultOptions = {
    generator: codeGenerator
};
export default class AssertGenerator {
    /**
     *
     * @param {Array<Object>} comments AST's comment nodes. it should be BlockComment
     * @param {AssertGeneratorOptions} options
     * @returns {Array<String>} array of assertion
     */
    static createAsserts(comments, options = {}) {
        if (comments == null) {
            return [];
        }
        const generator = options.generator || defaultOptions.generator;
        const isNotEmpty = (tag) => typeof tag !== undefined;
        // primitive
        const createTag = (tag) => {
            return AssertGenerator.createAssertFromTag(tag, generator);
        };
        return comments.tags.map(createTag).filter(isNotEmpty);
    }

    /**
     * @param tagNode tagNode is defined by doctorin
     * @param {CodeGenerator} generator
     * @return {string} return assertion code string
     * Reference https://esdoc.org/tags.html#type-syntax
     * https://github.com/eslint/doctrine/blob/master/test/parse.js
     */
    static createAssertFromTag(tagNode, generator = codeGenerator) {
        const title = tagNode.title;
        if (title !== "param") {
            return
        }
        const tagType = tagNode.type.type;
        if (tagType === "NameExpression") {
            return NameExpression(tagNode, generator);
        } else if (tagType === "AllLiteral") {
            return AllLiteral(tagNode, generator);
        } else if (tagType === "FunctionType") {
            return FunctionType(tagNode, generator);
        } else if (tagType === "RecordType") {
            return RecordType(tagNode, generator);
        } else if (tagType === "UnionType") {
            return UnionType(tagNode, generator);
        } else if (tagType === "TypeApplication") {
            return TypeApplication(tagNode, generator);
        } else if (tagType === "RestType") {
            return RestType(tagNode, generator);
        } else if (tagType === "NullableType") {
            return NullableType(tagNode, generator);
        } else if (tagType === "NonNullableType") {
            return NonNullableType(tagNode, generator);
        }
    }

};
