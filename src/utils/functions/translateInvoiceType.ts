import InvoiceType from "@/types/invoices/InvoiceType";

import { t } from "i18next";

const translateInvoiceType = (it: InvoiceType) => {
    switch (it) {
        case InvoiceType.Invoice: return t("invoices.Invoice");
        case InvoiceType.CreditNote: return t("invoices.CreditNote");
    }
};

export default translateInvoiceType;