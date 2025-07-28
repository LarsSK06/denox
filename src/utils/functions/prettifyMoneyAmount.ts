const prettifyMoneyAmount = (n: number) => {
    const isNegative = n < 0;

    const rawNumber =
        isNegative
            ? n - (n * 2)
            : n;

    const prettifiedNumber =
        `${rawNumber}`
            .split("")
            .toReversed()
            .map((d, i) =>
                i % 3 === 0
                    ? `${d} `
                    : d
            )
            .toReversed()
            .join("");
    
    return isNegative ? `- ${prettifiedNumber}` : prettifiedNumber;
};

export default prettifyMoneyAmount;