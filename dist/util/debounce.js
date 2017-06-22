import hash from './hash';

var timeouts = [];

export default function (func, wait) {
    var args = [], len = arguments.length - 2;
    while ( len-- > 0 ) args[ len ] = arguments[ len + 2 ];


    var key = hash(func),

        bounce = function () {
            var pass = [], len = arguments.length;
            while ( len-- ) pass[ len ] = arguments[ len ];

            clearTimeout(timeouts[key]);
            delete timeouts[key];
            func.apply(void 0, pass);
        },

        queue = function () {
            var pass = [], len = arguments.length;
            while ( len-- ) pass[ len ] = arguments[ len ];

            clearTimeout(timeouts[key]);
            timeouts[key] = setTimeout(function () { return bounce.apply(void 0, pass); }, wait);
        };

    if (args.length === 1 && args[0] === 'prepare') {
        return queue;
    }

    queue.apply(void 0, args);
};
