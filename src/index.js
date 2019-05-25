import foreground from './modules/ParallaxForeground';
import background from './modules/ParallaxBackground';

function xallarap(options = {}) {
    foreground(options.foreground);
    background(options.background);
}

export { foreground, background, xallarap };
