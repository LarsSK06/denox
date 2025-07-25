"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import DomainPeriodProgressCircle from "./DomainPeriodProgressCircle";
import DomainBasicDataContainer from "./DomainBasicDataContainer";
import DomainStatusChip from "./DomainStatusChip";

import { Skeleton } from "@mantine/core";

type DomainOverviewTabProps = {
    isDomainLoading: boolean;
    domain: DomainGetModel | null;
};

const DomainOverviewTab = ({ isDomainLoading, domain }: DomainOverviewTabProps) => {
    return (
        <div className="w-full flex flex-col gap-8">
            <DomainPeriodProgressCircle isDomainLoading={isDomainLoading} domain={domain} />

            {isDomainLoading ? (
                <Skeleton width={80} height={34.8} className="rounded-full" />
            ) : (
                domain ? (
                    <div className="w-fit mx-auto">
                        <DomainStatusChip status={domain.status} />
                    </div>
                ) : (
                    <></>
                )
            )}

            <DomainBasicDataContainer isDomainLoading={isDomainLoading} domain={domain} />
        </div>
    );
};

export default DomainOverviewTab;