const getHighestId = <T>(items: T[], getId: (item: T) => number) =>
    items.reduce((root, current) => {
        const currentId = getId(current);

        return currentId > root
            ? currentId
            : root;
    }, 0);

export default getHighestId;