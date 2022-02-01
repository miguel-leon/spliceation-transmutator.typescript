const deps = require('./package.json').dependencies;

const re = new RegExp(`^(${ Object.keys(deps).join('|') })`);

module.exports = (request, options) => {
	return request.match(re) ?
		require.resolve(request) :
		options.defaultResolver(request, options);
};
