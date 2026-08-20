import Currency from "../common/Currency";
import InvoiceStatus from "./InvoiceStatus";
import InvoiceType from "./InvoiceType";

type Invoice_GET = {
    id: number;
    type: InvoiceType;
    amount: number;
    currency: Currency;
    dueDate?: Date;
    issuedDate: Date;
    paidDate?: Date;
    status: InvoiceStatus;
    url: string;
};

export default Invoice_GET;