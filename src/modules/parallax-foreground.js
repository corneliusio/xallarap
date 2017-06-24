import Parallax from './parallax-abstract';

class ParallaxForeground extends Parallax {

    constructor(el, settings) {

        super();

        let compensate = !!(el.dataset.parallaxCompensate === '' || settings.compensate),
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

                setInterval(() => {

                    if (this.top < this.wheight) {
                        if (!this.parallax) {
                            this.measure();
                        }

                        if (Math.abs(prev - this.anchor) > 1) {
                            prev = this.anchor;
                            this.compensation = Math.round(this.boundary * this.scrolled);
                        }
                    }
                }, 128);
            }
        }
    }

    origin() {
        return this.middle - (this.parallax || 0);
    }

    update() {
        if (this.hack) {
            this.css.transform = `translate3d(0, ${this.parallax}px, 0)`;
        } else {
            this.css.transform = `translateY(${this.parallax}px)`;
        }
    }
}

export default (options = {}) => {

    const settings = Parallax.settings(options, '[data-parallax]');

    for (let i = 0; i < settings.el.length; ++i) {
        new ParallaxForeground(settings.el[i], settings);
    }
};
