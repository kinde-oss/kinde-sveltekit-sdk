export const pick = (target: Record<string, unknown>, path: string[]) => {
	return Object.keys(target).reduce((prev, curr) => {
		if (path.includes(curr)) {
			prev[curr] = target[curr];
		}
		return prev;
	}, {} as Record<string, unknown>);
};

export const omit = (target: Record<string, unknown>, path: string[]) => {
	return Object.keys(target).reduce((prev, curr) => {
		if (path.includes(curr)) {
			delete prev[curr];
		}
		return prev;
	}, {...target});
};
