import Parallax from './parallax-abstract';

var ParallaxForeground = (function (Parallax) {
    function ParallaxForeground(el, settings) {
        Parallax.call(this);
        this.el = el;
        this.init();
    }

    if ( Parallax ) ParallaxForeground.__proto__ = Parallax;
    ParallaxForeground.prototype = Object.create( Parallax && Parallax.prototype );
    ParallaxForeground.prototype.constructor = ParallaxForeground;

    ParallaxForeground.prototype.init = function init (settings) {

        if (this.reduceMotion) {
            return;
        }

        this.compensate = !!(this.el.dataset.parallaxCompensate === '' || settings.compensate);

        this.boundary = !isNaN(parseInt(this.el.dataset.parallaxAmount))
            ? parseInt(this.el.dataset.parallaxAmount)
            : settings.amount || 300;

        this.include = Math.abs(this.boundary);

        if (!!this.boundary) {
            this.css = this.el.style;
            this.css.display = 'inline-block';
            this.css.transition = 'initial';
            this.css.willChange = 'transform';
            this.css.transform = this.hack ? 'translate3d(0,0,0)' : 'translateY(0)';

            this.animate();
        }
    };

    ParallaxForeground.prototype.origin = function origin () {
        return this.middle - (this.parallax || 0);
    };

    ParallaxForeground.prototype.update = function update () {
        if (this.parallax !== this.pparallax) {
            this.pparallax = this.parallax;
            this.hack
                ? this.css.transform = "translate3d(0," + (this.parallax) + "px,0)"
                : this.css.transform = "translateY(" + (this.parallax) + "px)";
        }
    };

    return ParallaxForeground;
}(Parallax));

export default function (options) {
    if ( options === void 0 ) options = {};


    var settings = Parallax.settings(options, '[data-parallax]');

    for (var i = 0; i < settings.el.length; ++i) {
        new ParallaxForeground(settings.el[i], settings);
    }
};
