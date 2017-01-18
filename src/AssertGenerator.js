// LICENSE : MIT
"use strict";
const ObjectAssign = require("object-assign");
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
/**
 * @typedef {Object} AssertGeneratorOptions
 * @property {Function} generator
 */
const defaultOptions = {
    Generator: CodeGenerator
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
        const Generator = options.Generator || defaultOptions.Generator;
        const isNotEmpty = (tag) => {
            return tag != null;
        };
        // primitive
        const createTag = (tag) => {
            return AssertGenerator.createAssertFromTag(tag, Generator);
        };
        return comments.tags.map(createTag).filter(isNotEmpty);
    }

    /**
     * create assertions from @type
     * @param {string} name name is variable name
     * @param {Array<Object>} comments AST's comment nodes. it should be BlockComment
     * @param {AssertGeneratorOptions} options
     * @returns {Array<String>} array of assertion
     */
    static createTypeAsserts(name, comments, options = {}) {
        if (comments == null) {
            return [];
        }
        const Generator = options.Generator || defaultOptions.Generator;
        const isNotEmpty = (tag) => {
            return tag != null;
        };
        // primitive
        const createTag = (tag) => {
            return AssertGenerator.createAssertFromTypeTag(name, tag, Generator);
        };
        return comments.tags.map(createTag).filter(isNotEmpty);
    }

    /**
     * create assertion string from `typeNode` and `name`.
     * @param {string} [name] variable name
     * @param {{title:string, description: ?string, type:Object}} typeNode
     * @param {CodeGenerator} Generator
     * @returns {string|undefined}
     */
    static createAssertFromTypeTag(name, typeNode, Generator = CodeGenerator) {
        if (name === undefined) {
            return;
        }
        const title = typeNode.title;
        // @returns etc... are not param
        if (title !== "type") {
            return;
        }
        // @param x - x have not type
        if (typeNode.type == null) {
            return;
        }

        const node = ObjectAssign({}, {
            name
        }, typeNode);
        const generator = new Generator(node);
        const tagType = typeNode.type.type;
        switch (tagType) {
            case "NameExpression":
                return NameExpression(node, generator);
            case "AllLiteral":
                return AllLiteral(node, generator);
            case "FunctionType":
                return FunctionType(node, generator);
            case "RecordType":
                return RecordType(node, generator);
            case "UnionType":
                return UnionType(node, generator);
            case "TypeApplication":
                return TypeApplication(node, generator);
            case "RestType":
                return RestType(node, generator);
            case "NullableType":
                return NullableType(node, generator);
            case "NonNullableType":
                return NonNullableType(node, generator);
            default:
                return;
        }
    }

    /**
     * @param tagNode tagNode is defined by doctrine
     * @param {CodeGenerator} Generator
     * @return {string|undefined} return assertion code string
     * Reference https://esdoc.org/tags.html#type-syntax
     * https://github.com/eslint/doctrine/blob/master/test/parse.js
     */
    static createAssertFromTag(tagNode, Generator = CodeGenerator) {
        const title = tagNode.title;
        // @returns etc... are not param
        if (title !== "param") {
            return;
        }
        // @param x - x have not type
        if (tagNode.type == null) {
            return;
        }
        const generator = new Generator(tagNode);
        const tagType = tagNode.type.type;
        switch (tagType) {
            case "NameExpression":
                return NameExpression(tagNode, generator);
            case "AllLiteral":
                return AllLiteral(tagNode, generator);
            case "FunctionType":
                return FunctionType(tagNode, generator);
            case "RecordType":
                return RecordType(tagNode, generator);
            case "UnionType":
                return UnionType(tagNode, generator);
            case "TypeApplication":
                return TypeApplication(tagNode, generator);
            case "RestType":
                return RestType(tagNode, generator);
            case "NullableType":
                return NullableType(tagNode, generator);
            case "NonNullableType":
                return NonNullableType(tagNode, generator);
            default:
                return;
        }
    }
}
