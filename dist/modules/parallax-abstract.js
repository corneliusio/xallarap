
var Parallax = function Parallax() {
    this.compensate = false;
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

    if (NodeList.prototype.isPrototypeOf(options.el)) {
        options.el = Array.from(options.el);
    }

    if (!Array.isArray(options.el)) {
        options.el = [options.el];
    }

    return options;
};

Parallax.prototype.animate = function animate () {
        var this$1 = this;

    this.monitor();

    if (this.hasChanged() && this.isVisible()) {
        this.unchange();
        this.measure();
        this.update();
    }

    requestAnimationFrame(function () {
        this$1.animate();
    });
};

Parallax.prototype.hasChanged = function hasChanged () {
    return this.wtop !== this.pwtop
        || this.wheight !== this.pwheight
        || this.top > (this.ptop + 1)
        || this.top < (this.ptop - 1)
        || this.height > (this.pheight + 1)
        || this.height < (this.pheight - 1);
};

Parallax.prototype.unchange = function unchange () {
    this.pwtop = this.wtop;
    this.pwheight = this.wheight;
    this.ptop = this.top;
    this.pheight = this.height;
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

    var scrolled = this.compensate
        ? (this.wtop / this.wheight)
        : (this.wtop + (this.wheight / 2) - this.origin()) / (this.height + this.wheight);

    this.middle = this.top + (this.height / 2);
    this.margin = (this.boundary < 0)
        ? Math.abs(this.boundary)
        : Math.round(this.boundary * (1 - this.height / this.wheight));
    this.margin += 50;
    this.parallax = parseFloat((this.boundary * scrolled).toFixed(1));
};

Parallax.prototype.isVisible = function isVisible () {
    return this.bottom + this.include > this.wtop && this.top - this.include < this.wbottom;
};

export default Parallax;
