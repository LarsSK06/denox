const process = (body: any) => ({
    ...body,
    dueDate: body.dueDate && new Date(body.dueDate),
    issuedDate: new Date(body.issuedDate),
    paidDate: body.paidDate && new Date(body.paidDate)
});

const invoiceProcessor = (body: any) =>
    Array.isArray(body)
        ? body.map(process)
        : process(body);

export default invoiceProcessor;