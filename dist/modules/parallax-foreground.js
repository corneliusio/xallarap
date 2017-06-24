import Parallax from './parallax-abstract';

var ParallaxForeground = (function (Parallax) {
    function ParallaxForeground(el, settings) {
        var this$1 = this;


        Parallax.call(this);

        var compensate = !!(el.dataset.parallaxCompensate === '' || settings.compensate),
            prev = 0;

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

            if (compensate) {

                setInterval(function () {

                    if (this$1.top < this$1.wheight) {
                        if (!this$1.parallax) {
                            this$1.measure();
                        }

                        if (Math.abs(prev - this$1.anchor) > 1) {
                            prev = this$1.anchor;
                            this$1.compensation = Math.round(this$1.boundary * this$1.scrolled);
                        }
                    }
                }, 128);
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
