export const pick = (target: Record<string, unknown>, path: string[]) => {
	return Object.keys(target).reduce((prev, curr) => {
		if (path.includes(curr)) {
			prev[curr] = target[curr];
		}
		return prev;
	}, {} as Record<string, unknown>);
};

export const omit = (target: Record<string, unknown>, path: string[]) => {
	return Object.keys(target).reduce(
		(prev, curr) => {
			if (path.includes(curr)) {
				delete prev[curr];
			}
			return prev;
		},
		{...target}
	);
};

export const parseSearchParamsToObject = (search: string) => {
	const searchParams = new URLSearchParams(search);
	const paramsObject: Record<string, string | number> = {};

	for (const param of searchParams.entries()) {
		paramsObject[param[0]] = param[1];
	}

	return paramsObject;
};
