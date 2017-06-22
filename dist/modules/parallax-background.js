import Parallax from './parallax-abstract';
import debounce from '../util/debounce';

var ParallaxBackground = (function (Parallax) {
    function ParallaxBackground(container, settings) {
        var this$1 = this;


        Parallax.call(this);

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
            : settings.amount || Math.ceil(innerHeight / 2);
        this.include = 0;

        if (!!this.boundary) {

            this.el = document.createElement('div');
            this.img = document.createElement('img');
            this.img.src = src || settings.image || bg;
            this.css = this.el.style;

            this.wrap.style.position = 'relative';
            this.wrap.style.zIndex = 2;
            this.wrap.style.overflow = 'hidden';

            this.css.position = this.img.style.position = 'absolute';
            this.css.top = this.css.left = this.css.right = this.css.bottom = 0;
            this.css.zIndex = -1;
            this.css.backgroundSize = 'cover';
            this.css.backgroundPosition = 'center center';
            this.css.transition = 'unset';

            if (this.hack) {
                this.css.transform = 'translate3d(0, 0, 0)';
            } else {
                this.css.willChange = 'transform';
                this.css.transform = 'translateY(0)';
            }

            this.wrap.appendChild(this.el);

            this.img.addEventListener('load', function (event) {
                this$1.css.backgroundImage = "url(" + (this$1.img.src) + ")";

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

    if ( Parallax ) ParallaxBackground.__proto__ = Parallax;
    ParallaxBackground.prototype = Object.create( Parallax && Parallax.prototype );
    ParallaxBackground.prototype.constructor = ParallaxBackground;

    ParallaxBackground.prototype.origin = function origin () {
        return this.middle;
    };

    ParallaxBackground.prototype.update = function update () {

        this.margin = (this.boundary < 0)
            ? Math.abs(this.boundary)
            : Math.ceil(this.boundary * (1 - this.height / this.wheight));

        this.css.minHeight = (this.wrap.offsetHeight + this.margin) + "px";

        if (this.hack) {
            this.css.transform = "translate3d(0, " + (this.parallax - (this.margin / 2)) + "px, 0)";
        } else {
            this.css.transform = "translateY(" + (this.parallax - (this.margin / 2)) + "px)";
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
