// LICENSE : MIT
"use strict";
const doctrine = require('doctrine');
import AssertGenerator from "./AssertGenerator"
export default class CommentConverter {
    /**
     * Parse comment nodes which is provided by JavaScript parser like esprima, babylon
     * and return assertions code strings.
     * This is mutable function.
     * @param {Array<Object>} comment
     * @param {AssertGeneratorOptions} [options]
     * @returns {string[]}
     */
    static toAsserts(comment, options) {
        /*
         TODO: sloppy is not support
         It mean that optional param just ignored.
         */
        try {
            const commentData = doctrine.parse(comment.value, {unwrap: true});
            return AssertGenerator.createAsserts(commentData, options);
        } catch (error) {
            error.message = "jsdoc-to-assert: JSDoc Parse Error:\n" + error.message;
            throw error;
        }
    }
}