const process = (body: any) => ({
    ...body,
    registeredDate: new Date(body.registeredDate),
    expiryDate: new Date(body.expiryDate)
});

const domainProcessor = (body: any) =>
    Array.isArray(body)
        ? body.map(process)
        : process(body);

export default domainProcessor;