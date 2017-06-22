import Parallax from './parallax-abstract';

var ParallaxForeground = (function (Parallax) {
    function ParallaxForeground(el, settings) {

        Parallax.call(this);

        var compensate = !!(el.dataset.parallaxCompensate || settings.compensate);

        if (this.reduceMotion) {
            return;
        }

        this.boundary = !isNaN(parseInt(el.dataset.parallaxAmount))
            ? parseInt(el.dataset.parallaxAmount)
            : settings.amount || 300;
        this.include = Math.abs(this.boundary);

        if (!!this.boundary) {
            this.el = el;
            this.css = this.el.style;
            this.css.display = 'inline-block';

            if (this.hack) {
                this.css.transform = 'translate3d(0, 0, 0)';
            } else {
                this.css.willChange = 'transform';
                this.css.transform = 'translateY(0)';
            }

            this.animate();

            if (compensate && this.top < this.wheight) {

                if (!this.parallax) {
                    this.measure();
                }

                var relativeOrigin = ((this.wheight / 2) - this.anchor) / (this.height + this.wheight);

                this.compensation = Math.round(relativeOrigin * this.boundary);
            }
        }
    }

    if ( Parallax ) ParallaxForeground.__proto__ = Parallax;
    ParallaxForeground.prototype = Object.create( Parallax && Parallax.prototype );
    ParallaxForeground.prototype.constructor = ParallaxForeground;

    ParallaxForeground.prototype.origin = function origin () {
        return this.middle - (this.parallax || 0);
    };

    ParallaxForeground.prototype.update = function update () {
        if (this.hack) {
            this.css.transform = "translate3d(0, " + (this.parallax) + "px, 0)";
        } else {
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
