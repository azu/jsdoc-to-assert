// LICENSE : MIT
"use strict";
/*
    @param {*} x 
 */
import CodeGenerator from "../CodeGenerator";
/**
 * @return {string}
 */
export function AllLiteral(tag) {
    return CodeGenerator.assert(`(typeof ${tag.name} !== "undefined")`)
}