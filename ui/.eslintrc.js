module.exports = {
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "func-style": 0,
        "func-names": 0,
        "arrow-parens": [
            "off",
            "as-needed"
        ],
        "no-cond-assign": "error",
        "no-console": [
            "off",
            {
                "allow": [
                    "dir",
                    "time",
                    "timeEnd",
                    "timeLog",
                    "trace",
                    "assert",
                    "clear",
                    "count",
                    "countReset",
                    "group",
                    "groupEnd",
                    "table",
                    "debug",
                    "info",
                    "dirxml",
                    "error",
                    "groupCollapsed",
                    "Console",
                    "profile",
                    "profileEnd",
                    "timeStamp",
                    "context"
                ]
            }
        ],
        "no-constant-condition": 2,
        "no-control-regex": 2,
        "no-debugger": "error",
        "no-dupe-args": 2,
        "no-dupe-keys": 2,
        "no-duplicate-case": 2,
        "no-empty-character-class": 2,
        "no-empty": "off",
        "no-ex-assign": 2,
        "no-extra-boolean-cast": 2,
        "no-extra-parens": 0,
        "no-func-assign": 2,
        "no-inner-declarations": [
            2,
            "both"
        ],
        "no-invalid-regexp": 2,
        "no-irregular-whitespace": "off",
        "no-negated-in-lhs": 2,
        "no-obj-calls": 2,
        "no-regex-spaces": 2,
        "no-sparse-arrays": 2,
        "no-unreachable": 2,
        "use-isnan": "error",
        "valid-jsdoc": 0,
        "valid-typeof": "off",
        "accessor-pairs": 2,
        "block-scoped-var": 2,
        "complexity": "off",
        "consistent-return": 0,
        "curly": "error",
        "default-case": 0,
        "dot-notation": "error",
        "eqeqeq": [
            "error",
            "smart"
        ],
        "no-alert": 2,
        "no-caller": "error",
        "no-case-declarations": 2,
        "no-div-regex": 2,
        "no-else-return": 2,
        "no-labels": 2,
        "no-empty-pattern": 2,
        "no-eq-null": 2,
        "no-eval": "error",
        "no-extend-native": 2,
        "no-extra-bind": 2,
        "no-fallthrough": "off",
        "no-implicit-coercion": 0,
        "no-implied-eval": 2,
        "no-iterator": 2,
        "no-lone-blocks": 2,
        "no-loop-func": 2,
        "no-magic-numbers": [
            0,
            {
                "ignore": [
                    -1,
                    0,
                    1,
                    2
                ]
            }
        ],
        "no-multi-str": 2,
        "no-native-reassign": 2,
        "no-new-func": 2,
        "no-new-wrappers": "error",
        "no-new": 2,
        "no-octal-escape": 2,
        "no-octal": 2,
        "no-proto": 2,
        "no-redeclare": 2,
        "no-script-url": 2,
        "no-self-compare": 2,
        "no-sequences": 2,
        "no-throw-literal": "error",
        "no-unused-expressions": "error",
        "no-useless-call": 2,
        "no-useless-concat": 2,
        "no-void": 2,
        "no-warning-comments": 0,
        "no-with": 2,
        "radix": "error",
        "vars-on-top": 2,
        "strict": [
            2,
            "never"
        ],
        "init-declarations": 0,
        "no-catch-shadow": 2,
        "no-delete-var": 2,
        "no-label-var": 2,
        "no-shadow-restricted-names": 2,
        "no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "no-undef-init": "error",
        "no-undef": 2,
        "no-unused-vars": [
            2,
            {
                "args": "after-used",
                "argsIgnorePattern": "^_"
            }
        ],
        "no-use-before-define": [
            2,
            "nofunc"
        ],
        "consistent-this": [
            2,
            "self"
        ],
        "eol-last": "off",
        "id-length": 0,
        "id-match": "error",
        "indent": [
            0,
            2,
            {
                "SwitchCase": 1
            }
        ],
        "linebreak-style": "off",
        "lines-around-comment": 0,
        "max-depth": 0,
        "max-len": "off",
        "max-nested-callbacks": 0,
        "max-params": 0,
        "max-statements": 0,
        "new-cap": 0,
        "newline-after-var": 0,
        "no-array-constructor": 2,
        "no-inline-comments": 0,
        "no-lonely-if": 2,
        "no-nested-ternary": 2,
        "no-new-object": 2,
        "no-plusplus": [
            2,
            {
                "allowForLoopAfterthoughts": true
            }
        ],
        "no-ternary": 0,
        "no-unneeded-ternary": 2,
        "one-var": [
            "error",
            "never"
        ],
        "operator-assignment": [
            2,
            "always"
        ],
        "require-jsdoc": 0,
        "sort-vars": 0,
        "spaced-comment": "error",
        "wrap-regex": 0,
        "arrow-body-style": "error",
        "no-confusing-arrow": 0,
        "no-class-assign": 2,
        "no-const-assign": 2,
        "no-dupe-class-members": 2,
        "no-this-before-super": 2,
        "no-var": "error",
        "object-shorthand": "error",
        "prefer-arrow-callback": 0,
        "prefer-const": "error",
        "prefer-template": 2,
        "react/display-name": 0,
        "react/jsx-boolean-value": [
            2,
            "always"
        ],
        "react/jsx-key": 2,
        "react/jsx-no-duplicate-props": 2,
        "react/jsx-no-undef": 2,
        "react/jsx-sort-props": 0,
        "react/jsx-sort-prop-types": 0,
        "react/jsx-uses-react": 2,
        "react/jsx-uses-vars": 2,
        "react/no-danger": 2,
        "react/no-did-mount-set-state": 0,
        "react/no-did-update-set-state": 2,
        "react/no-direct-mutation-state": 2,
        "react/no-is-mounted": 2,
        "react/no-multi-comp": 0,
        "react/no-set-state": 0,
        "react/no-string-refs": 0,
        "react/no-unknown-property": 2,
        "react/prop-types": 2,
        "react/prefer-es6-class": [
            0,
            "never"
        ],
        "react/react-in-jsx-scope": 2,
        "react/require-extension": 0,
        "react/self-closing-comp": 0,
        "react/sort-comp": 0,
        "jest/no-disabled-tests": "warn",
        "jest/no-focused-tests": "error",
        "babel/no-invalid-this": 1,
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": "error",
        "@typescript-eslint/ban-types": "error",
        "@typescript-eslint/class-name-casing": "error",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/interface-name-prefix": "error",
        "@typescript-eslint/member-delimiter-style": [
            "off",
            {
                "multiline": {
                    "delimiter": "none",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/member-ordering": "error",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-for-of": "off",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/quotes": "off",
        "@typescript-eslint/camelcase": "off",
        "@typescript-eslint/semi": [
            "off",
            null
        ],
        "@typescript-eslint/space-within-parens": [
            "off",
            "never"
        ],
        "@typescript-eslint/triple-slash-reference": "error",
        "@typescript-eslint/type-annotation-spacing": "off",
        "@typescript-eslint/unified-signatures": "error",
        "comma-dangle": "off",
        "constructor-super": "error",
        "guard-for-in": "error",
        "id-blacklist": [
            "error",
            "any",
            "Number",
            "String",
            "Boolean",
            "boolean",
            "Undefined",
        ],
        "import/order": "off",
        "max-classes-per-file": [
            "error",
            1
        ],
        "new-parens": "off",
        "newline-per-chained-call": "off",
        "no-bitwise": "error",
        "no-extra-semi": "off",
        "no-invalid-this": "off",
        "no-multiple-empty-lines": "off",
        "no-trailing-spaces": "off",
        "no-unsafe-finally": "error",
        "no-unused-labels": "error",
        "quote-props": "off",
        "space-before-function-paren": "off",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "jsdoc-format": true,
                    "jsx-boolean-value": true,
                    "jsx-key": true,
                    "jsx-no-bind": true,
                    "jsx-no-lambda": true,
                    "jsx-no-string-ref": true,
                    "jsx-self-close": true,
                    "no-reference-import": true
                }
            }
        ]
    }
};
