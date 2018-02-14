
export default class Parallax {

    constructor() {
        this.compensate = false;
        this.include = innerHeight;
        this.hack = (!window.CSS || !CSS.supports || !CSS.supports('will-change', 'transform'));
        this.reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion)').matches;
    }

    static settings(options, defaultSelector) {

        const dom = query => document.querySelectorAll(query);

        switch (typeof options.el) {

            case 'string' :
                options.el = dom(options.el);
                break;

            case 'object' :
                options.el = options.el;
                break;

            default :
                options.el = dom(defaultSelector);
                break;
        }

        if (NodeList.prototype.isPrototypeOf(options.el)) {
            options.el = Array.from(options.el);
        }

        if (!Array.isArray(options.el)) {
            options.el = [options.el];
        }

        return options;
    }

    animate() {
        this.monitor();

        if (this.hasChanged() && this.isVisible()) {
            this.unchange();
            this.measure();
            this.update();
        }

        requestAnimationFrame(() => {
            this.animate();
        });
    }

    hasChanged() {
        return this.wtop !== this.pwtop
            || this.wheight !== this.pwheight
            || this.top > (this.ptop + 1)
            || this.top < (this.ptop - 1)
            || this.height > (this.pheight + 1)
            || this.height < (this.pheight - 1);
    }

    unchange() {
        this.pwtop = this.wtop;
        this.pwheight = this.wheight;
        this.ptop = this.top;
        this.pheight = this.height;
    }

    monitor() {
        this.wtop = pageYOffset;
        this.wheight = innerHeight;
        this.wbottom = this.wtop + this.wheight;
        this.top = this.el.getBoundingClientRect().top + this.wtop;
        this.height = this.el.offsetHeight;
        this.bottom = this.top + this.height;
    }

    measure() {

        let scrolled = this.compensate
            ? (this.wtop / this.wheight)
            : (this.wtop + (this.wheight / 2) - this.origin()) / (this.height + this.wheight);

        this.middle = this.top + (this.height / 2);
        this.margin = (this.boundary < 0)
            ? Math.abs(this.boundary)
            : Math.round(this.boundary * (1 - this.height / this.wheight));
        this.margin += 50;
        this.parallax = parseFloat((this.boundary * scrolled).toFixed(1));

        if (this.css.setProperty) {
            this.css.setProperty('--parallax-control', scrolled);
        }
    }

    isVisible() {
        return this.bottom + this.include > this.wtop && this.top - this.include < this.wbottom;
    }
}
