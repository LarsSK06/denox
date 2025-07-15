const getArrayFromNumber = (n: number) => {
    const result = [];

    for (let i = 0; i < n; i++) result.push(i);

    return result;
};

export default getArrayFromNumber;