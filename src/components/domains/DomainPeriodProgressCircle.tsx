"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import prettifyDate from "@/utils/functions/prettifyDate";

import { SemiCircleProgress } from "@mantine/core";
import { t } from "i18next";
import { useMemo } from "react";

type DomainPeriodProgressCircleProps = {
    domain: DomainGetModel;
};

const DomainPeriodProgressCircle = ({ domain }: DomainPeriodProgressCircleProps) => {
    const elapsedPercentage = useMemo(() => {
        const registeredDateMs = domain.registeredDate.getTime();
        const expiryDateMs = domain.expiryDate.getTime();
        const nowMs = new Date().getTime();
        
        const rdmsToEdms = expiryDateMs - registeredDateMs;
        const rdmsToNms = nowMs - registeredDateMs;

        return (rdmsToNms / rdmsToEdms) * 100;
    }, [domain]);

    return (
        <SemiCircleProgress
            className="mx-auto"
            size={512}
            value={elapsedPercentage}
            label={
                <>
                    <span>
                        {t("domains.PercentageOfDomainPeriodElapsed", { percentage: Math.round(elapsedPercentage * 10) / 10 })}
                    </span>

                    <br />

                    <span>
                        <time dateTime={domain.registeredDate.toISOString().split("T")[0]}>
                            {prettifyDate(domain.registeredDate)}
                        </time>
                        {' '}
                        -
                        {' '}
                        <time dateTime={domain.expiryDate.toISOString().split("T")[0]}>
                            {prettifyDate(domain.expiryDate)}
                        </time>
                    </span>
                </>
            }
        />
    );
};

export default DomainPeriodProgressCircle;