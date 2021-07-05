export default {
    desktop: () => window.matchMedia("(min-width:1024px)").matches,
    tablet: () => window.matchMedia("(max-width:1023px)").matches
};