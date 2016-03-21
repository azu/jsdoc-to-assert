// LICENSE : MIT
"use strict";
/*
    @param {*} x 
 */
/**
 * @return {string}
 */
export function AllLiteral(tag, CodeGenerator) {
    return CodeGenerator.assert(`(typeof ${tag.name} !== "undefined")`)
}