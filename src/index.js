import foreground from './modules/parallax-foreground';
import background from './modules/parallax-background';

function xallarap(options = {}) {
    foreground(options.foreground);
    background(options.background);
}

export { foreground, background, xallarap };
