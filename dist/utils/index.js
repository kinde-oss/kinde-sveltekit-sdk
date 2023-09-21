export const pick = (target, path) => {
    return Object.keys(target).reduce((prev, curr) => {
        if (path.includes(curr)) {
            prev[curr] = target[curr];
        }
        return prev;
    }, {});
};
export const omit = (target, path) => {
    return Object.keys(target).reduce((prev, curr) => {
        if (path.includes(curr)) {
            delete prev[curr];
        }
        return prev;
    }, { ...target });
};
