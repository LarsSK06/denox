type ParsableObj = { [_: string]: any };

const singularSnakeToCamelCase = (str: string) =>
    str.replaceAll(/\w_\w/g, value => {
        const [first,,last] = value.split("");

        return `${first.toLowerCase()}${last.toUpperCase()}`;
    });

const snakeToCamelCase = <ReturnType extends ParsableObj | []>(obj: ParsableObj | []): ReturnType => {
    if (obj instanceof Array) return obj.map(i => snakeToCamelCase(i)) as ReturnType;

    return Object.keys(obj).reduce<ParsableObj>((root, current) => {
        return {
            ...root,
            [singularSnakeToCamelCase(current)]:
                typeof obj[current] === "object"
                    ? snakeToCamelCase(obj[current])
                    : obj[current]
        } as ReturnType;
    }, {}) as ReturnType;
};

export default snakeToCamelCase;