export function redirectSystemPath({ path, initial }: { path: string; initial: boolean }) {
	try {
		if (initial || !path.startsWith('http')) {
			if (path.includes('home')) {
				return '/';
			}
			return path;
		}
		const newPath = path.replace(/.*\/app/, '');
		if (newPath === path) {
			return '/';
		}
		return newPath;
	} catch {
		return '/';
	}
}
