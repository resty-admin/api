module.exports = function (options, webpack) {
	return {
		...options,
		plugins: [
			...options.plugins,
			new webpack.NormalModuleReplacementPlugin(
				/src[\\\/]environments[\\\/]environment.ts/,
				`./environment${process.env.NODE_ENV ? "." + process.env.NODE_ENV : ""}.ts`
			)
		]
	};
};
