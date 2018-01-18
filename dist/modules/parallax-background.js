import Parallax from './parallax-abstract';
import debounce from '../util/debounce';

var ParallaxBackground = (function (Parallax) {
    function ParallaxBackground(container, settings) {
        Parallax.call(this);
        this.wrap = container;
        this.init(settings);
    }

    if ( Parallax ) ParallaxBackground.__proto__ = Parallax;
    ParallaxBackground.prototype = Object.create( Parallax && Parallax.prototype );
    ParallaxBackground.prototype.constructor = ParallaxBackground;

    ParallaxBackground.prototype.init = function init (settings) {
        var this$1 = this;


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
            this.css.transition = 'initial';
            this.css.willChange = 'transform';
            this.css.transform = this.hack ? 'translate3d(0,0,0)' : 'translateY(0)';

            this.wrap.style.position = 'relative';
            this.wrap.style.zIndex = 2;
            this.wrap.style.overflow = 'hidden';

            this.wrap.appendChild(this.el);

            this.img.addEventListener('load', function () {

                this$1.img = null;

                this$1.measure();
                this$1.update();
            });

            window.addEventListener('resize', function () {
                debounce(function () {
                    this$1.measure();
                    this$1.update();
                }, 256);
            });

            this.animate();
        }
    };

    ParallaxBackground.prototype.origin = function origin () {
        return this.middle;
    };

    ParallaxBackground.prototype.update = function update () {

        if (this.margin !== this.pmargin) {
            this.css.minHeight = (this.wrap.offsetHeight + this.margin) + "px";
            this.pmargin = this.margin;
        }

        if (this.parallax !== this.pparallax) {
            var p = parseFloat((this.parallax - (this.margin / 2)).toFixed(1));

            this.pparallax = this.parallax;

            this.hack
                ? this.css.transform = "translate3d(0," + p + "px,0)"
                : this.css.transform = "translateY(" + p + "px)";
        }
    };

    return ParallaxBackground;
}(Parallax));

export default function (options) {
    if ( options === void 0 ) options = {};


    var settings = Parallax.settings(options, '[data-parallax-background],[data-parallax-bg]');

    for (var i = 0; i < settings.el.length; ++i) {
        new ParallaxBackground(settings.el[i], settings);
    }
};
