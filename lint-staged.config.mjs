/**
 * @see https://github.com/lint-staged/lint-staged?tab=readme-ov-file#configuration
 * @type {import("lint-staged").Config}
 */

const config = {
	'*.{js,jsx,ts,tsx}': ['prettier --write', 'eslint --fix', 'eslint'],
	'*.{json,md,yml}': ['prettier --write'],
};

export default config;
