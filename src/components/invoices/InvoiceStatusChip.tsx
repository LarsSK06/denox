import InvoiceStatus from "@/types/invoices/InvoiceStatus";
import translateInvoiceStatus from "@/utils/functions/translateInvoiceStatus";
import ColoredPill from "../common/ColoredPill";

import { useMemo } from "react";

type InvoiceStatusChipProps = {
    status: InvoiceStatus;
};

const InvoiceStatusChip = ({ status }: InvoiceStatusChipProps) => {
    const color = useMemo(() => {
        switch (status) {
            case InvoiceStatus.Unpaid: return "red";

            case InvoiceStatus.Paid: return "green";

            case InvoiceStatus.Settled: return "yellow";
        }
    }, [status]);

    return (
        <ColoredPill color={color}>
            {translateInvoiceStatus(status)}
        </ColoredPill>
    );
};

export default InvoiceStatusChip;