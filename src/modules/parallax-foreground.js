import Parallax from './parallax-abstract';

class ParallaxForeground extends Parallax {

    constructor(el, settings) {

        super();

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
            this.css.transition = 'initial';
            this.css.willChange = 'transform';
            this.css.transform = this.hack ? 'translate3d(0,0,0)' : 'translateY(0)';

            this.animate();
        }
    }

    origin() {
        return this.middle - (this.parallax || 0);
    }

    update() {
        if (this.parallax !== this.pparallax) {
            this.pparallax = this.parallax;
            this.hack
                ? this.css.transform = `translate3d(0,${this.parallax}px,0)`
                : this.css.transform = `translateY(${this.parallax}px)`;
        }
    }
}

export default (options = {}) => {

    const settings = Parallax.settings(options, '[data-parallax]');

    for (let i = 0; i < settings.el.length; ++i) {
        new ParallaxForeground(settings.el[i], settings);
    }
};
