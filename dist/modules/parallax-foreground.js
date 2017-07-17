import Parallax from './parallax-abstract';

var ParallaxForeground = (function (Parallax) {
    function ParallaxForeground(el, settings) {

        Parallax.call(this);

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

    if ( Parallax ) ParallaxForeground.__proto__ = Parallax;
    ParallaxForeground.prototype = Object.create( Parallax && Parallax.prototype );
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

export default function (options) {
    if ( options === void 0 ) options = {};


    var settings = Parallax.settings(options, '[data-parallax]');

    for (var i = 0; i < settings.el.length; ++i) {
        new ParallaxForeground(settings.el[i], settings);
    }
};
