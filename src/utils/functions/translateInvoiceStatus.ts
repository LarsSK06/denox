import InvoiceStatus from "@/types/invoices/InvoiceStatus";

import { t } from "i18next";

const translateInvoiceStatus = (is: InvoiceStatus) => {
    switch (is) {
        case InvoiceStatus.Unpaid: return t("common.Unpaid");
        case InvoiceStatus.Paid: return t("common.Paid");
        case InvoiceStatus.Settled: return t("common.Settled");
    }
};

export default translateInvoiceStatus;