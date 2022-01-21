export const timestamp = () => {
	return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
};
