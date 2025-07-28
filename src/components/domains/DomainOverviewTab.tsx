"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import DomainPeriodProgressCircle from "./DomainPeriodProgressCircle";
import DomainBasicDataContainer from "./DomainBasicDataContainer";
import DomainStatusChip from "./DomainStatusChip";

import { Transition } from "@mantine/core";
import { dummyDomain } from "@/utils/globals";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";

type DomainOverviewTabProps = {
    isDomainLoading: boolean;
    domain: DomainGetModel | null;
};

const DomainOverviewTab = ({ isDomainLoading, domain: _domain }: DomainOverviewTabProps) => {
    const domain = _domain ?? dummyDomain;

    const { allowAnimations } = useSettingsContext();

    return (
        <Transition mounted={!isDomainLoading} exitDuration={0} transition="fade-up" duration={allowAnimations ? undefined : 0}>
            {style => (
                <div className="w-full flex flex-col gap-8" style={style}>
                    <DomainPeriodProgressCircle domain={domain} />

                    <div className="w-fit mx-auto">
                        <DomainStatusChip status={domain.status} />
                    </div>

                    <DomainBasicDataContainer domain={domain} />
                </div>
            )}
        </Transition>
    );
};

export default DomainOverviewTab;