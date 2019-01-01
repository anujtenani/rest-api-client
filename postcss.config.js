const tailwindcss = require('tailwindcss');
const purgecss = require('@fullhuman/postcss-purgecss');

module.exports = ctx => ({
    plugins: [
        require('postcss-import')(),
        tailwindcss('./tailwind.js'),
        require('autoprefixer'),
        ctx.env === "production" ?
        purgecss({
            content: ['./src/**/*.js'],
            whitelistPatterns: [/Codemirror-.*/,/cm-*/],
            extractors: [
                {
                    extractor: class {
                        static extract(content) {
                            return content.match(/[A-z0-9-:\/]+/g) || []
                        }
                    },
                    extensions: ['js']
                }
            ]
        }): undefined
    ],
});
