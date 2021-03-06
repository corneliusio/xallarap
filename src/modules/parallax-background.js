import Parallax from './parallax-abstract';
import debounce from '../util/debounce';

class ParallaxBackground extends Parallax {
    constructor(container, settings) {
        super();
        this.wrap = container;
        this.init(settings);
    }

    init(settings) {
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

        if (!!this.boundary) {
            this.el = document.createElement('div');
            this.img = document.createElement('img');
            this.img.src = src || settings.image || bg;
            this.css = this.el.style;

            this.css.backgroundImage = `url(${this.img.src})`;
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

            this.img.addEventListener('load', () => {
                this.img = null;

                this.measure();
                this.update();
            });

            window.addEventListener('resize', () => {
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
        if (this.margin !== this.pmargin) {
            let currentMinHeight = parseInt(this.css.minHeight),
                potentialMinHeight = this.wrap.offsetHeight + this.margin;

            if (isNaN(currentMinHeight) || Math.abs(currentMinHeight - potentialMinHeight) > 5) {
                this.css.minHeight = `${potentialMinHeight}px`;
            }

            this.pmargin = this.margin;
        }

        if (this.parallax !== this.pparallax) {
            let p = parseFloat((this.parallax - (this.margin / 2)).toFixed(1));

            this.pparallax = this.parallax;

            this.hack
                ? this.css.transform = `translate3d(0,${p}px,0)`
                : this.css.transform = `translateY(${p}px)`;
        }
    }
}

export default (options = {}) => {
    const settings = Parallax.settings(options, '[data-parallax-background],[data-parallax-bg]');

    for (let i = 0; i < settings.el.length; ++i) {
        new ParallaxBackground(settings.el[i], settings);
    }
};
