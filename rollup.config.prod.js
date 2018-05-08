const babel = require('rollup-plugin-babel');

module.exports = {
    input: 'src/index.es.js',
    output: {
        file: 'dist/xallarap.js',
        format: 'es'
    },
    plugins: [
        babel({
            babelrc: false,
            presets: [
                ['@babel/env', {
                    modules: false
                }]
            ]
        })
    ]
};
