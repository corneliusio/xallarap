const babel = require('rollup-plugin-babel');
const common = require('rollup-plugin-commonjs');
const { terser } = require('rollup-plugin-terser');
const resolve = require('rollup-plugin-node-resolve');

module.exports = [
    {
        input: 'src/index.js',
        output: {
            file: 'dist/xallarap.js',
            format: 'esm'
        },
        plugins: [
            resolve(),
            common(),
            // babel({
            //     extensions: [ '.js' ],
            //     exclude: 'node_modules/core-js/**'
            // })
        ]
    },
    {
        input: 'src/index.js',
        output: {
            file: 'dist/xallarap.min.js',
            format: 'iife',
            name: 'xallarap',
            sourcemap: true
        },
        plugins: [
            resolve(),
            common(),
            babel({
                extensions: [ '.js' ],
                exclude: 'node_modules/core-js/**'
            }),
            terser()
        ]
    }
];
