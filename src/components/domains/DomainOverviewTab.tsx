"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import DomainPeriodProgressCircle from "./DomainPeriodProgressCircle";
import DomainStatusChip from "./DomainStatusChip";
import DomainNameserversList from "./DomainNameserversList";
import DomainServicesContainer from "./DomainServicesContainer";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";

import { Transition } from "@mantine/core";
import { dummyDomain } from "@/utils/globals";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { usePositionContext } from "@/utils/contexts/usePositionContext";
import { useEffect } from "react";

const DomainOverviewTab = () => {

    const { allowAnimations } = useSettingsContext();
    const { domainId } = usePositionContext();

    const {
        isLoading: isDomainLoading,
        data: domain,
        setData: setDomain,
        call: getDomain
    } = useHttpClient<DomainGetModel>({
        endpoint: [Endpoint.Domains, domainId],
        process: body => ({
            ...body,
            registeredDate: new Date(body.registeredDate),
            expiryDate: new Date(body.expiryDate)
        })
    });

    useEffect(() => {
        if (!domainId) setDomain(null);
        else getDomain();

        return () => setDomain(null);
    }, [domainId]);

    return (
        <Transition mounted={!!domain} exitDuration={0} transition="fade-up" duration={allowAnimations ? undefined : 0}>
            {style => (
                <div className="w-full p-2 flex flex-col gap-8" style={style}>
                    <DomainPeriodProgressCircle domain={domain ?? dummyDomain} />

                    <div className="w-fit mx-auto">
                        <DomainStatusChip status={(domain ?? dummyDomain).status} />
                    </div>

                    <DomainServicesContainer domain={domain ?? dummyDomain} />

                    <DomainNameserversList domain={domain ?? dummyDomain} />
                </div>
            )}
        </Transition>
    );
};

export default DomainOverviewTab;