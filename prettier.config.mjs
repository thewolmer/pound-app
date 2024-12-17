/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */

const config = {
	semi: true,
	singleQuote: true,
	trailingComma: 'es5',
	printWidth: 120,
	tabWidth: 2,
	endOfLine: 'auto',
	plugins: ['prettier-plugin-tailwindcss'],
};

export default config;
