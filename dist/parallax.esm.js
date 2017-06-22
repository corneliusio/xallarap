import parallaxForeground from './modules/parallax-foreground';
import parallaxBackground from './modules/parallax-background';

export {
    parallaxForeground as foreground,
    parallaxBackground as background
};

export default function (options) {
    if ( options === void 0 ) options = {};

    parallaxForeground(options.foreground);
    parallaxBackground(options.background);
};
