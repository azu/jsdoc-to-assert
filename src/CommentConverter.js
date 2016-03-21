// LICENSE : MIT
"use strict";
const doctrine = require('doctrine');
import AssertGenerator from "./AssertGenerator"
export default class CommentConverter {
    /**
     * FunctionDeclaration to FunctionDeclaration
     * This is mutable function.
     * @param {Array<Object>} comment
     * @param {options} [options]
     * @returns {Object}
     */
    static toAsserts(comment, options) {
        /*
         TODO: sloppy is not support
         It mean that optional param just ignored.
         */
        const commentData = doctrine.parse(comment.value, {unwrap: true});
        return AssertGenerator.createAsserts(commentData, options);
    }
}