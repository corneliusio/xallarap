(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.xallarap = factory());
}(this, (function () { 'use strict';

var Parallax = function Parallax() {
    this.compensate = false;
    this.reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion)').matches;
};

Parallax.settings = function settings (options, defaultSelector) {

    var dom = function (query) { return document.querySelectorAll(query); };

    switch (typeof options.el) {

        case 'string' :
            options.el = dom(options.el);
            break;

        case 'object' :
            options.el = options.el;
            break;

        default :
            options.el = dom(defaultSelector);
            break;
    }

    return options;
};

Parallax.prototype.animate = function animate () {
        var this$1 = this;

    this.monitor();

    if (this.hasChanged() && this.isVisible()) {
        this.unchange();
        this.measure();
        this.update();
    }

    requestAnimationFrame(function () {
        this$1.animate();
    });
};

Parallax.prototype.hasChanged = function hasChanged () {
    return this.wtop !== this.pwtop
        || this.wheight !== this.pwheight
        || this.top !== this.ptop
        || this.height !== this.pheight;
};

Parallax.prototype.unchange = function unchange () {
    this.pwtop = this.wtop;
    this.pwheight = this.wheight;
    this.ptop = this.top;
    this.pheight = this.height;
};

Parallax.prototype.monitor = function monitor () {
    this.wtop = pageYOffset;
    this.wheight = innerHeight;
    this.wbottom = this.wtop + this.wheight;
    this.top = this.el.getBoundingClientRect().top + this.wtop;
    this.height = this.el.offsetHeight;
    this.bottom = this.top + this.height;
};

Parallax.prototype.measure = function measure () {

    var scrolled = this.compensate
        ? (this.wtop / this.wheight)
        : (this.wtop + (this.wheight / 2) - this.origin()) / (this.height + this.wheight);

    this.middle = this.top + (this.height / 2);
    this.margin = (this.boundary < 0)
        ? Math.abs(this.boundary)
        : Math.round(this.boundary * (1 - this.height / this.wheight));
    this.margin += 100;
    this.parallax = Math.round(this.boundary * scrolled);
};

Parallax.prototype.isVisible = function isVisible () {
    return this.bottom + this.include > this.wtop && this.top - this.include < this.wbottom;
};

var ParallaxForeground = (function (Parallax$$1) {
    function ParallaxForeground(el, settings) {

        Parallax$$1.call(this);

        if (this.reduceMotion) {
            return;
        }

        this.compensate = !!(el.dataset.parallaxCompensate === '' || settings.compensate);

        this.boundary = !isNaN(parseInt(el.dataset.parallaxAmount))
            ? parseInt(el.dataset.parallaxAmount)
            : settings.amount || 300;

        this.include = Math.abs(this.boundary);

        if (!!this.boundary) {
            this.el = el;
            this.css = this.el.style;
            this.css.display = 'inline-block';
            this.css.willChange = 'transform';
            this.css.transform = 'translateY(0)';

            this.animate();
        }
    }

    if ( Parallax$$1 ) ParallaxForeground.__proto__ = Parallax$$1;
    ParallaxForeground.prototype = Object.create( Parallax$$1 && Parallax$$1.prototype );
    ParallaxForeground.prototype.constructor = ParallaxForeground;

    ParallaxForeground.prototype.origin = function origin () {
        return this.middle - (this.parallax || 0);
    };

    ParallaxForeground.prototype.update = function update () {
        if (this.parallax !== this.pparallax) {
            this.pparallax = this.parallax;
            this.css.transform = "translateY(" + (this.parallax) + "px)";
        }
    };

    return ParallaxForeground;
}(Parallax));

var parallaxForeground = function (options) {
    if ( options === void 0 ) options = {};


    var settings = Parallax.settings(options, '[data-parallax]');

    for (var i = 0; i < settings.el.length; ++i) {
        new ParallaxForeground(settings.el[i], settings);
    }
};

var hash = function (input) {

    var str = input.toString(),
        len = str.length,
        hash = 0,
        chr;

    if (len === 0) {
        return hash;
    }

    for (var i = 0; i < len; i++) {
        chr = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }

    return Math.abs(hash).toString();
};

var timeouts = [];

var debounce = function (func, wait) {
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

var ParallaxBackground = (function (Parallax$$1) {
    function ParallaxBackground(container, settings) {
        var this$1 = this;


        Parallax$$1.call(this);

        this.wrap = container;

        var src = (this.wrap.dataset.parallaxBackground || this.wrap.dataset.parallaxBg),
            bg = getComputedStyle(this.wrap).backgroundImage.replace(/url\("?([^)"]+)"?\)/, '$1');

        if (this.reduceMotion) {

            if (bg === 'none') {
                this.wrap.style.backgroundImage = "url(" + src + ")";
            }

            return;
        }

        this.boundary = !isNaN(parseInt(this.wrap.dataset.parallaxAmount))
            ? parseInt(this.wrap.dataset.parallaxAmount)
            : settings.amount || Math.round(innerHeight / 2);

        this.include = Math.round(innerHeight / 2);

        if (!!this.boundary) {

            this.el = document.createElement('div');
            this.img = document.createElement('img');
            this.img.src = src || settings.image || bg;
            this.css = this.el.style;

            this.css.backgroundImage = "url(" + (this.img.src) + ")";
            this.css.position = this.img.style.position = 'absolute';
            this.css.top = this.css.left = this.css.right = this.css.bottom = 0;
            this.css.zIndex = -1;
            this.css.backgroundSize = 'cover';
            this.css.backgroundPosition = 'center center';
            this.css.transition = 'unset';
            this.css.willChange = 'transform';
            this.css.transform = 'translateY(0)';

            this.wrap.style.position = 'relative';
            this.wrap.style.zIndex = 2;
            this.wrap.style.overflow = 'hidden';

            this.wrap.appendChild(this.el);

            this.img.addEventListener('load', function (event) {

                delete this$1.img;

                this$1.measure();
                this$1.update();
            });

            window.addEventListener('resize', function (event) {
                debounce(function () {
                    this$1.measure();
                    this$1.update();
                }, 256);
            });

            this.animate();
        }
    }

    if ( Parallax$$1 ) ParallaxBackground.__proto__ = Parallax$$1;
    ParallaxBackground.prototype = Object.create( Parallax$$1 && Parallax$$1.prototype );
    ParallaxBackground.prototype.constructor = ParallaxBackground;

    ParallaxBackground.prototype.origin = function origin () {
        return this.middle;
    };

    ParallaxBackground.prototype.update = function update () {

        if (this.margin !== this.pmargin) {
            this.css.minHeight = (this.wrap.offsetHeight + this.margin) + "px";
            this.pmargin = this.margin;
        }

        if (this.parallax !== this.pparallax) {
            this.pparallax = this.parallax;
            this.css.transform = "translateY(" + (Math.round(this.parallax - (this.margin / 2))) + "px)";
        }
    };

    return ParallaxBackground;
}(Parallax));

var parallaxBackground = function (options) {
    if ( options === void 0 ) options = {};


    var settings = Parallax.settings(options, '[data-parallax-background],[data-parallax-bg]');

    for (var i = 0; i < settings.el.length; ++i) {
        new ParallaxBackground(settings.el[i], settings);
    }
};

var parallax = function (options) {
    if ( options === void 0 ) options = {};

    parallaxForeground(options.foreground);
    parallaxBackground(options.background);
};

return parallax;

})));
