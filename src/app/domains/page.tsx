"use client";

import DomainDnsTab from "@/components/domains/DomainDnsTab";
import DomainOverviewTab from "@/components/domains/DomainOverviewTab";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useSearchParamId from "@/utils/hooks/useSearchParamId";

import { SegmentedControl } from "@mantine/core";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
    const [tab, setTab] = useState<"overview" | "dns" | null>("overview");

    const searchParams = useSearchParams();
    const router = useRouter();
    const domainId = useSearchParamId({ key: "domainId", type: "number" });

    const {
        isLoading: isDomainLoading,
        data: domain,
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
        setTab(searchParams.get("tab") as typeof tab);
    }, [searchParams]);

    useEffect(() => {
        if (domainId) getDomain();
    }, [domainId]);

    return (
        <div className="p-2">
            <SegmentedControl
                value={tab ?? undefined}
                data={[
                    { value: "overview", label: "overview" },
                    { value: "dns", label: "dns" }
                ]}
                onChange={value => router.replace(`/domains?domainId=${domainId}&tab=${value}`)}
            />

            <div className="mt-2" aria-live="assertive">
                {tab === "overview" || tab === null ? (
                    <DomainOverviewTab isDomainLoading={isDomainLoading} domain={domain} />
                ) : null}

                {tab === "dns" ? (
                    <DomainDnsTab isDomainLoading={isDomainLoading} domain={domain} />
                ) : null}
            </div>
        </div>
    );
};

export default Page;