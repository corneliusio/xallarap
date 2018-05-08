import foreground from './modules/parallax-foreground';
import background from './modules/parallax-background';

export default (options = {}) => {
    foreground(options.foreground);
    background(options.background);
};
