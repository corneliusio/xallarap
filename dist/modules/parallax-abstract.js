
var Parallax = function Parallax() {
    this.compensation = 0;
    this.hack = (!window.CSS || !CSS.supports || !CSS.supports('will-change', 'transform'));
    this.reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion)').matches;
};

Parallax.settings = function settings (options, defaultSelector) {

    var dom = function (query) { return document.querySelectorAll(query); };

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
};

Parallax.prototype.animate = function animate () {
        var this$1 = this;

    this.monitor();

    if (this.isVisible()) {
        this.measure();
        this.update();
    }

    requestAnimationFrame(function () {
        this$1.animate();
    });
};

Parallax.prototype.monitor = function monitor () {
    this.wtop = pageYOffset;
    this.wheight = innerHeight;
    this.wbottom = this.wtop + this.wheight;
    this.top = this.el.getBoundingClientRect().top + this.wtop;
    this.height = this.el.offsetHeight;
    this.bottom = this.top + this.height;
};

Parallax.prototype.measure = function measure () {
    this.wmiddle = this.wtop + (this.wheight / 2);
    this.middle = this.top + (this.height / 2);
    this.anchor = this.origin();
    this.scrolled = (this.wmiddle - this.anchor) / (this.height + this.wheight);
    this.parallax = Math.round(this.boundary * this.scrolled) - this.compensation;
};

Parallax.prototype.isVisible = function isVisible () {
    return this.bottom + this.include > this.wtop && this.top - this.include < this.wbottom;
};

export default Parallax;
