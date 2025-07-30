import ColoredPill from "../common/ColoredPill";
import DomainWebHotelSize from "@/types/domains/DomainWebHotelSize";
import translateDomainWebHotelSize from "@/utils/functions/translateDomainWebHotelSize";

import { useMemo } from "react";

type DomainWebHotelSizeChipProps = {
    size: DomainWebHotelSize;
};

const DomainWebHotelSizeChip = ({ size }: DomainWebHotelSizeChipProps) => {
    const color = useMemo(() => {
        switch (size) {
            case DomainWebHotelSize.None: return "gray";
            case DomainWebHotelSize.Small: return "red";
            case DomainWebHotelSize.Medium: return "orange";
            case DomainWebHotelSize.Large: return "green";
            case DomainWebHotelSize.XLarge: return "blue";
        }
    }, [size]);

    return (
        <ColoredPill color={color}>
            {translateDomainWebHotelSize(size)}
        </ColoredPill>
    );
};

export default DomainWebHotelSizeChip;