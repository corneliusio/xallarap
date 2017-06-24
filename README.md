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
            el: document.querySelectorAll('[data-parallax]'),
            compensate: false,
            amount: 300
        },
        background: {
            el: document.querySelectorAll('[data-parallax-background]'), // Assign path to image to value of `data-parallax-background` in your HTML
            amount: Math.ceil(window.innerHeight / 2)
        }
    });
});

```

All options can be assigned (or overwritten) with the data attributes seen below.

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
    parallax();
});

```


## The "Hello, world." Example

You can use this method to just toss some parallax on a page quickly.

There are two parallax components to this plugin, background and foreground. You can initialize a parallaxed background image with the `data-parallax-background` data attribute. For any elements in the foreground that you would like to apply a parallax effect to, simply apply the `data-parallax` attibute.

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

**That's it!**

### But wait, there's more.

You can also define the parallax amount and direction via data attributes.

```html

    <div data-parallax-background="https://example.com/path/to/some/image.jpg" data-parallax-amount="200">
        <h1>
            <span data-parallax data-parallax-amount="-100">Hello, world.</span>
        </h1>
    </div>

```

By default, the plugin will use some percentage of the viewport height to determine the amount of parallax to apply, but you can set this manually by providing a number as the value of `data-parallax-amount`. This number can either be positive or negative depending on the direction you want the parallax to flow.

Perhaps you have a banner on your page that is 100vh, and you want a little arrow at the bottom of the banner urging the user to scroll down. But you want to have that arrow slowly move away as the user scrolls. Here's where `data-parallax-compensate` will come in handy.

```html
    <div class="banner" data-parallax-background="/some/image.jpg"> // height: 100vh;
        <h1> // Cool text vertically centered with CSS already. No need to adjust starting position of letters.
            <span data-parallax data-parallax-amount="-200">P</span>
            <span data-parallax data-parallax-amount="300">a</span>
            <span data-parallax data-parallax-amount="-50">r</span>
            <span data-parallax data-parallax-amount="200">a</span>
            <span data-parallax data-parallax-amount="-200">l</span>
            <span data-parallax data-parallax-amount="100">l</span>
            <span data-parallax data-parallax-amount="400">a</span>
            <span data-parallax data-parallax-amount="-350">x</span>
        </h1>

        <div class="banner-arrow" data-parallax data-parallax-amount="800" data-parallax-compensate>&darr;</div> // Absolutely positioned center bottom of banner.
    </div>
```

A parallax amount of 800 will give the effect of having the arrow "run away" from the user as they scroll down. However, since it is below the center of the viewport, the parallax effect will actually pull it up instead of leaving it at the bottom like we want. Adding the `data-parallax-compensate` attibute will tell the plugin to not apply the parallax relative to the center of the viewport, but from wherever the element is relative to the viewport at initialization.

This last point might be a little difficult to understand without simply trying it out.

---

[MIT License](LICENSE.md). © 2017 [Cornelius Ukena](https://cornelius.io).
