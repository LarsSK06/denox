import punycode from "punycode/punycode";

const process = (body: any) => ({
    ...body,
    domain: punycode.toUnicode(body.domain),
    expiryDate: new Date(body.expiryDate),
    registeredDate: new Date(body.registeredDate)
});

const domainProcessor = (body: any) =>
    Array.isArray(body)
        ? body.map(process)
        : process(body);

export default domainProcessor;