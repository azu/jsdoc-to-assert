# jsdoc-to-assert [![Build Status](https://travis-ci.org/azu/jsdoc-to-assert.svg?branch=master)](https://travis-ci.org/azu/jsdoc-to-assert)

Convert JSDoc to `assert` that runtime assert.

## Installation

    npm install jsdoc-to-assert

## Usage

```js
import {AssertGenerator, Attachment} from "jsdoc-to-assert";
```


### AssertGenerator class

    /**
     *
     * @param {Array<Object>} comments AST's comment nodes. it should be BlockComment
     * @returns {Array} array of assert AST node that is unwrapped 
     */
    static createAsserts(comments) {}

### Attachment class

    /**
     * FunctionDeclaration to FunctionDeclaration
     * This is mutable function.
     * @param node
     * @param comment
     * @returns {Object}
     */
    static FunctionDeclaration(node, comment);

    /**
     * @param {Array<Object>} comment
     * @returns {string}
     */
    static FunctionDeclarationString(comment);

    /**
     * AST to AST
     * mutable function
     * @param {Object} AST
     * @returns {Object}
     */
    static toASTFromAST(AST);
    /**
     * Code to AST
     * @param {string} content
     */
    static toASTFromCode(content);
}
## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT