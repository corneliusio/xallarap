import parallaxForeground from './modules/parallax-foreground';
import parallaxBackground from './modules/parallax-background';

export {
    parallaxForeground as foreground,
    parallaxBackground as background
};

export default (options = {}) => {
    parallaxForeground(options.foreground);
    parallaxBackground(options.background);
};
