import DomainGetModel from "@/types/domains/DomainGetModel";
import prettifyDate from "@/utils/functions/prettifyDate";

import { SemiCircleProgress, Skeleton } from "@mantine/core";
import { t } from "i18next";
import { useMemo } from "react";

type DomainPeriodProgressCircleProps = {
    isDomainLoading: boolean;
    domain: DomainGetModel | null;
};

const DomainPeriodProgressCircle = ({ isDomainLoading, domain }: DomainPeriodProgressCircleProps) => {

    const elapsedPercentage = useMemo(() => {
        if (!domain) return 0;

        const registeredDateMs = domain.registeredDate.getTime();
        const expiryDateMs = domain.expiryDate.getTime();
        const nowMs = new Date().getTime();
        
        const rdmsToEdms = expiryDateMs - registeredDateMs;
        const rdmsToNms = nowMs - registeredDateMs;

        return Math.round((rdmsToNms / rdmsToEdms) * 100);
    }, [domain]);

    return !isDomainLoading && domain ? (
        <SemiCircleProgress
            className="mx-auto"
            size={512}
            value={elapsedPercentage}
            label={
                <>
                    <span>
                        {t("domains.PercentageOfDomainPeriodElapsed", { percentage: elapsedPercentage })}
                    </span>

                    <br />

                    <span>
                        <time dateTime={domain.registeredDate.toDateString()}>
                            {prettifyDate(domain.registeredDate)}
                        </time>
                        {' '}
                        -
                        {' '}
                        <time dateTime={domain.expiryDate.toDateString()}>
                            {prettifyDate(domain.expiryDate)}
                        </time>
                    </span>
                </>
            }
        />
    ) : (
        <Skeleton width={500} height={249} className="mx-auto mt-[7px] rounded-none rounded-t-full" />
    );
};

export default DomainPeriodProgressCircle;