import Parallax from './parallax-abstract';
import debounce from '../util/debounce';

class ParallaxBackground extends Parallax {

    constructor(container, settings) {

        super();

        this.wrap = container;

        let src = (this.wrap.dataset.parallaxBackground || this.wrap.dataset.parallaxBg),
            bg = getComputedStyle(this.wrap).backgroundImage.replace(/url\("?([^)"]+)"?\)/, '$1');

        if (this.reduceMotion) {

            if (bg === 'none') {
                this.wrap.style.backgroundImage = `url(${src})`;
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

            this.img.addEventListener('load', event => {
                this.css.backgroundImage = `url(${this.img.src})`;

                delete this.img;

                this.measure();
                this.update();
            });

            window.addEventListener('resize', event => {
                debounce(() => {
                    this.measure();
                    this.update();
                }, 256);
            });

            this.animate();
        }
    }

    origin() {
        return this.middle;
    }

    update() {

        this.margin = (this.boundary < 0)
            ? Math.abs(this.boundary)
            : Math.round(this.boundary * (1 - this.height / this.wheight));

        this.css.minHeight = `${this.wrap.offsetHeight + this.margin}px`;

        if (this.hack) {
            this.css.transform = `translate3d(0, ${Math.round(this.parallax - (this.margin / 2))}px, 0)`;
        } else {
            this.css.transform = `translateY(${Math.round(this.parallax - (this.margin / 2))}px)`;
        }
    }
}

export default (options = {}) => {

    const settings = Parallax.settings(options, '[data-parallax-background],[data-parallax-bg]');

    for (let i = 0; i < settings.el.length; ++i) {
        new ParallaxBackground(settings.el[i], settings);
    }
};
