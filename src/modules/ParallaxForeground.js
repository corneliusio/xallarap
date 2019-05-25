import Parallax from './Parallax';

class ParallaxForeground extends Parallax {
    constructor(el, settings) {
        super();
        this.el = el;
        this.init(settings);
    }

    init(settings) {
        if (this.reduceMotion) {
            return;
        }

        this.compensate = !!(this.el.dataset.parallaxCompensate === '' || settings.compensate);

        this.boundary = !isNaN(parseInt(this.el.dataset.parallaxAmount))
            ? parseInt(this.el.dataset.parallaxAmount)
            : settings.amount || 300;

        if (!!this.boundary) {
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
