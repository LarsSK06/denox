import DomainStatus from "@/types/domains/DomainStatus";

import { t } from "i18next";

const translateDomainStatus = (ds: DomainStatus) => {
    switch (ds) {
        case DomainStatus.Active: return t("common.Active");
        case DomainStatus.Expired: return t("common.Expired");
        case DomainStatus.Deactivated: return t("common.Deactivated");
        case DomainStatus.PendingDeleteRestorable: return t("common.PendingDeleteRestorable");
    }
};

export default translateDomainStatus;