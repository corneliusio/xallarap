# Xallarap

Super simple, lightweight parallax.

[![NPM version](https://img.shields.io/npm/v/xallarap.svg?style=flat-square)](http://npmjs.com/package/xallarap)
![Github file size](https://img.shields.io/github/size/corneliusio/xallarap/dist/xallarap.min.js.svg?style=flat-square)
![gzip file size](https://img.badgesize.io/https://unpkg.com/xallarap/dist/xallarap.min.js?compression=gzip&label=gzip&style=flat-square)
[![license](https://img.shields.io/github/license/corneliusio/xallarap.svg?style=flat-square)](https://github.com/corneliusio/xallarap/blob/master/LICENSE)

---

## Browser support

| Chrome | Edge | Firefox | Safari / iOS | UC Android | Samsung |
| ------ | ---- | ------- | ------------ | ---------- | ------- |
| 60+    | 14+  | 53+     | 10+          | 11+        | 6+      |

**Note: This package does not support IE anymore.  
If you're looking for IE11 support, you can install `xallarap@^0.2.8`  
or make sure you're compiling down to ES5 with something like [@babel/preset-env](https://www.npmjs.com/package/@babel/preset-env)**

---

## Get Down to Business

```shell
npm install xallarap --save
```

```js
import parallax from 'xallarap';


(start => {
    if (document.readyState !== 'loading') {
        start();
    } else {
        document.addEventListener('DOMContentLoaded', start);
    }
})(() => {
    parallax({
        foreground: {
            el: '.parallax',
            compensate: false,
            amount: 300
        },
        background: {
            el: '.parallax-background',
            image: '/path/to/some/image.jpg',
            amount: Math.ceil(window.innerHeight / 2)
        }
    });
});
```

*All options can be assigned (or overwritten) with the data attributes seen below.*

You can also use ES6 modules to take advantage or tree-shaking with [Webpack](https://webpack.js.org) or [Rollup](https://rollupjs.org).

```js
import {background as parallax} from 'xallarap';


(start => {
    if (document.readyState !== 'loading') {
        start();
    } else {
        document.addEventListener('DOMContentLoaded', start);
    }
})(() => {
    parallax({
        el: '.parallax-background',
        image: '/path/to/some/image.jpg',
        amount: Math.ceil(window.innerHeight / 2)
    });
});
```

---

## Usage

### options.foreground.el  
Type: `string|array|node` Default: `[data-parallax]`

### options.foreground.compensate `[data-parallax-compensate]`  
Type: `bool` Default `false`

### options.foreground.amount `[data-parallax-amount]`  
Type: `int` Default: `300`

### options.background.el  
Type: `array|string|node` Default: `[data-parallax-background]`

### options.background.image `[data-parallax-background]`  
Type: `bool` Default `false`

### options.background.amount `[data-parallax-amount]`  
Type: `int` Default: `Math.ceil(window.innerHeight / 2)`

---

## Hello, World.
You can use this method to just toss some parallax on a page quickly.

```html
<div data-parallax-background="https://example.com/path/to/some/image.jpg">
    <h1>
        <span data-parallax>Hello, world.</span>
    </h1>
</div>
```

Then, you can simply load the script and initial it.

```html
<script src="https://unpkg.com/xallarap"></script>

<script>
    // Using jQuery
    $(document).ready(function() {
        window.xallarap();
    });

    // or vanilla JS
    (function(start) {
        if (document.readyState !== 'loading') {
            start();
        } else {
            document.addEventListener('DOMContentLoaded', start);
        }
    })(function() {
        window.xallarap();
    });
</script>

```

**You’re all set!**

---

[MIT License](LICENSE.md). &copy; 2017 [Cornelius Ukena](https://cornelius.io).
