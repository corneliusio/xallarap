
export default class Parallax {

    constructor() {
        this.compensation = 0;
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

        if (isNaN(options.amount)) {

        }

        return options;
    }

    animate() {
        this.monitor();

        if (this.isVisible()) {
            this.measure();
            this.update();
        }

        requestAnimationFrame(() => {
            this.animate();
        });
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
        this.wmiddle = this.wtop + (this.wheight / 2);
        this.middle = this.top + (this.height / 2);
        this.anchor = this.origin();
        this.scrolled = (this.wmiddle - this.anchor) / (this.height + this.wheight);
        this.parallax = Math.round(this.boundary * this.scrolled) - this.compensation;
    }

    isVisible() {
        return this.bottom + this.include > this.wtop && this.top - this.include < this.wbottom;
    }
}
