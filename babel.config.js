module.exports = (api) => {
	api.cache(true);
	return {
		presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
		plugins: [
			[
				'module-resolver',
				{
					root: ['./'],
					alias: {
						'~env': './config/env.js',
					},
					extensions: ['.ios.ts', '.android.ts', '.ts', '.ios.tsx', '.android.tsx', '.tsx', '.jsx', '.js', '.json'],
				},
				'react-native-reanimated/plugin', // this has to be listed last. idk why
			],
		],
	};
};
