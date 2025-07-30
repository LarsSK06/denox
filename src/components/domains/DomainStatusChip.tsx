import DomainStatus from "@/types/domains/DomainStatus";
import translateDomainStatus from "@/utils/functions/translateDomainStatus";
import ColoredPill from "../common/ColoredPill";

import { useMemo } from "react";

type DomainStatusChipProps = {
    status: DomainStatus;
};

const DomainStatusChip = ({ status }: DomainStatusChipProps) => {
    const color = useMemo(() => {
        switch (status) {
            case DomainStatus.Active: return "green";
            case DomainStatus.Expired: return "blue";
            case DomainStatus.Deactivated: return "red";
            case DomainStatus.PendingDeleteRestorable: return "yellow";
        }
    }, [status]);

    return (
        <ColoredPill color={color} size="xl">
            {translateDomainStatus(status)}
        </ColoredPill>
    );
};

export default DomainStatusChip;