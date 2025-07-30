import DomainWebHotelSize from "@/types/domains/DomainWebHotelSize";

import { t } from "i18next";

const translateDomainWebHotelSize = (size: DomainWebHotelSize) => {
    switch (size) {
        case DomainWebHotelSize.None: return t("common.None");
        case DomainWebHotelSize.Small: return t("common.Small");
        case DomainWebHotelSize.Medium: return t("common.Medium");
        case DomainWebHotelSize.Large: return t("common.Large");
        case DomainWebHotelSize.XLarge: return t("common.ExtraLarge");
    }
};

export default translateDomainWebHotelSize;