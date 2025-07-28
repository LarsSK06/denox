import InvoiceStatus from "@/types/invoices/InvoiceStatus";
import translateInvoiceStatus from "@/utils/functions/translateInvoiceStatus";
import useColorScheme from "@/utils/hooks/useColorScheme";

import { Pill, useMantineTheme } from "@mantine/core";
import { useMemo } from "react";

type InvoiceStatusChipProps = {
    status: InvoiceStatus;
};

const InvoiceStatusChip = ({ status }: InvoiceStatusChipProps) => {
    const mantineTheme = useMantineTheme();
    
        const { isDark: isColorSchemeDark } = useColorScheme();
    
        const [backgroundColor, borderColor] = useMemo(() => {
            let mantineColorTuple;
    
            switch (status) {
                case InvoiceStatus.Unpaid:
                    mantineColorTuple = mantineTheme.colors.red;
                    break;

                case InvoiceStatus.Paid:
                    mantineColorTuple = mantineTheme.colors.green;
                    break;

                case InvoiceStatus.Settled:
                    mantineColorTuple = mantineTheme.colors.yellow;
                    break;
            }
    
            return [mantineColorTuple[isColorSchemeDark ? 9 : 2], mantineColorTuple[isColorSchemeDark ? 2 : 9]] as [string, string];
        }, [status]);
    
        return (
            <Pill styles={{ root: { backgroundColor, borderColor, borderWidth: "1px" } }} aria-hidden>
                {translateInvoiceStatus(status)}
            </Pill>
        );
};

export default InvoiceStatusChip;