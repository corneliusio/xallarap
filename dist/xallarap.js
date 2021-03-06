class Parallax {
  constructor() {
    this.compensate = false;
    this.include = innerHeight;
    this.hack = !window.CSS || !CSS.supports || !CSS.supports('will-change', 'transform');
    this.reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion)').matches;
  }

  static settings(options, defaultSelector) {
    var dom = query => document.querySelectorAll(query);

    switch (typeof options.el) {
      case 'string':
        options.el = dom(options.el);
        break;

      case 'object':
        options.el = options.el;
        break;

      default:
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
    return this.wtop !== this.pwtop || this.wheight !== this.pwheight || this.top > this.ptop + 1 || this.top < this.ptop - 1 || this.height > this.pheight + 1 || this.height < this.pheight - 1;
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
    this.middle = this.top + this.height / 2;
  }

  measure() {
    var scrolled = this.compensate ? this.wtop / this.wheight : (this.wtop + this.wheight / 2 - this.origin()) / (this.height + this.wheight);
    this.margin = this.boundary < 0 ? Math.abs(this.boundary) : Math.round(this.boundary * (1 - this.height / this.wheight));
    this.margin += 50;
    this.parallax = parseFloat((this.boundary * scrolled).toFixed(1));

    if (this.css.setProperty) {
      this.css.setProperty('--parallax-control', parseFloat(scrolled).toFixed(4));
    }
  }

  isVisible() {
    return this.bottom + this.include > this.wtop && this.top - this.include < this.wbottom;
  }

}

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
    this.boundary = !isNaN(parseInt(this.el.dataset.parallaxAmount)) ? parseInt(this.el.dataset.parallaxAmount) : settings.amount || 300;

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
      this.hack ? this.css.transform = "translate3d(0,".concat(this.parallax, "px,0)") : this.css.transform = "translateY(".concat(this.parallax, "px)");
    }
  }

}

var foreground = (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var settings = Parallax.settings(options, '[data-parallax]');

  for (var i = 0; i < settings.el.length; ++i) {
    new ParallaxForeground(settings.el[i], settings);
  }
});

var hash = (input => {
  var str = input.toString(),
      len = str.length,
      hash = 0,
      chr;

  if (len === 0) {
    return hash;
  }

  for (var i = 0; i < len; i++) {
    chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }

  return Math.abs(hash).toString();
});

var timeouts = [];
var debounce = (function (func, wait) {
  var key = hash(func),
      bounce = function bounce() {
    clearTimeout(timeouts[key]);
    delete timeouts[key];
    func(...arguments);
  },
      queue = function queue() {
    for (var _len2 = arguments.length, pass = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      pass[_key2] = arguments[_key2];
    }

    clearTimeout(timeouts[key]);
    timeouts[key] = setTimeout(() => bounce(...pass), wait);
  };

  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }

  if (args.length === 1 && args[0] === 'prepare') {
    return queue;
  }

  queue(...args);
});

class ParallaxBackground extends Parallax {
  constructor(container, settings) {
    super();
    this.wrap = container;
    this.init(settings);
  }

  init(settings) {
    var src = this.wrap.dataset.parallaxBackground || this.wrap.dataset.parallaxBg,
        bg = getComputedStyle(this.wrap).backgroundImage.replace(/url\("?([^)"]+)"?\)/, '$1');

    if (this.reduceMotion) {
      if (bg === 'none') {
        this.wrap.style.backgroundImage = "url(".concat(src, ")");
      }

      return;
    }

    this.boundary = !isNaN(parseInt(this.wrap.dataset.parallaxAmount)) ? parseInt(this.wrap.dataset.parallaxAmount) : settings.amount || Math.round(innerHeight / 2);

    if (!!this.boundary) {
      this.el = document.createElement('div');
      this.img = document.createElement('img');
      this.img.src = src || settings.image || bg;
      this.css = this.el.style;
      this.css.backgroundImage = "url(".concat(this.img.src, ")");
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
      var currentMinHeight = parseInt(this.css.minHeight),
          potentialMinHeight = this.wrap.offsetHeight + this.margin;

      if (isNaN(currentMinHeight) || Math.abs(currentMinHeight - potentialMinHeight) > 5) {
        this.css.minHeight = "".concat(potentialMinHeight, "px");
      }

      this.pmargin = this.margin;
    }

    if (this.parallax !== this.pparallax) {
      var p = parseFloat((this.parallax - this.margin / 2).toFixed(1));
      this.pparallax = this.parallax;
      this.hack ? this.css.transform = "translate3d(0,".concat(p, "px,0)") : this.css.transform = "translateY(".concat(p, "px)");
    }
  }

}

var background = (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var settings = Parallax.settings(options, '[data-parallax-background],[data-parallax-bg]');

  for (var i = 0; i < settings.el.length; ++i) {
    new ParallaxBackground(settings.el[i], settings);
  }
});

var index_es = (function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  foreground(options.foreground);
  background(options.background);
});

export default index_es;
export { background, foreground };
