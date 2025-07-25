"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import prettifyDate from "@/utils/functions/prettifyDate";
import useMount from "@/utils/hooks/useMount";

import { SemiCircleProgress, Skeleton, Transition } from "@mantine/core";
import { t } from "i18next";
import { useMemo } from "react";

type DomainPeriodProgressCircleProps = {
    isDomainLoading: boolean;
    domain: DomainGetModel | null;
};

const DomainPeriodProgressCircle = ({ isDomainLoading, domain }: DomainPeriodProgressCircleProps) => {
    const isMounted = useMount();

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
        <Transition mounted={isMounted} transition="fade-up">
            {style => (
                <SemiCircleProgress
                    style={style}
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
            )}
        </Transition>
    ) : (
        <Skeleton width={500} height={249} className="mx-auto mt-[7px] rounded-none rounded-t-full" />
    );
};

export default DomainPeriodProgressCircle;