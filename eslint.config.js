import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';

export default [
    {
        ignores: ['**/*.js', '**/*.cjs', '**/*.mjs', 'docs/**', 'node_modules/**', 'static/**'],
    },
    js.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                ecmaVersion: 2021,
                sourceType: 'module',
                project: ['tsconfig.json'],
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2021,
                ...globals.jest,
            },
        },
        plugins: {
            '@typescript-eslint': tsPlugin,
            'unused-imports': unusedImports,
            'simple-import-sort': simpleImportSort,
        },
        rules: {
            ...tsPlugin.configs.recommended.rules,
            ...tsPlugin.configs['recommended-requiring-type-checking'].rules,
            ...tsPlugin.configs.strict.rules,
            indent: ['error', 4, { SwitchCase: 1 }],
            'require-atomic-updates': 'warn',
            'no-console': 'warn',
            quotes: ['error', 'single'],
            'unused-imports/no-unused-imports': 'error',
            'no-useless-escape': 'off',
            'no-duplicate-imports': 'error',
            'no-tabs': ['error', { allowIndentationTabs: true }],
            '@typescript-eslint/consistent-type-definitions': 'off',
            '@typescript-eslint/no-base-to-string': [
                'error',
                {
                    ignoredTypeNames: ['BigNumberish'],
                },
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/no-angle-bracket-type-assertion': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-extraneous-class': 'off',
            '@typescript-eslint/indent': 'off',
            '@typescript-eslint/no-unused-vars': 'warn',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/naming-convention': [
                'error',
                {
                    selector: 'interface',
                    format: ['PascalCase'],
                    prefix: ['I'],
                },
            ],
            'simple-import-sort/imports': [
                'error',
                {
                    groups: [
                        ['^aurelia', '^@aurelia'],
                        ['^(@|lib)(/.*|$)'],
                        ['^\\u0000'],
                        ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
                        ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
                        ['^.+\\.?(css)$'],
                    ],
                },
            ],
            'object-curly-spacing': ['error', 'always'],
        },
    },
    {
        files: ['src/models/generated/**/*.ts'],
        rules: {
            '@typescript-eslint/ban-tslint-comment': 'off',
            indent: ['warn', 4],
        },
    },
    {
        files: ['src/**/*.spec.ts'],
        rules: {
            '@typescript-eslint/unbound-method': 'off',
            '@typescript-eslint/ban-ts-comment': 'off',
        },
    },
];
