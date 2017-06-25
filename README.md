# Xallarap (Parallax)

Super simple, lightweight parallax.

[![Github file size](https://img.shields.io/github/size/corneliusio/xallarap/dist/parallax.min.js.svg?style=flat-square)]() [![license](https://img.shields.io/github/license/corneliusio/xallarap.svg?style=flat-square)](https://github.com/corneliusio/xallarap/blob/master/LICENSE)

---

## Get Down to Business

`npm install xallarap --save`

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


## Usage

**options.foreground.el**  
Type: `string|array|node` Default: `[data-parallax]`

**options.foreground.compensate** `[data-parallax-compensate]`  
Type: `bool` Default `false`

**options.foreground.amount** `[data-parallax-amount]`  
Type: `int` Default: `300`

**options.background.el**  
Type: `array|string|node` Default: `[data-parallax-background]`

**options.background.image** `[data-parallax-background]`  
Type: `bool` Default `false`

**options.background.amount** `[data-parallax-amount]`  
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

    // If you use this method, specify the most recent version in
    // as part of your request for quicker resolution.
    // (e.g. https://unpkg.com/xallarap@0.1.2)
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

**You’re set!**

---

[MIT License](LICENSE.md). © 2017 [Cornelius Ukena](https://cornelius.io).
