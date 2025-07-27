"use client";

import DomainDnsTab from "@/components/domains/DomainDnsTab";
import DomainOverviewTab from "@/components/domains/DomainOverviewTab";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionIcon, SegmentedControl, Tooltip } from "@mantine/core";
import { t } from "i18next";
import { IconAddressBook, IconBolt, IconCloudComputing, IconExternalLink, IconRestore } from "@tabler/icons-react";
import IllustrationIcons from "@/components/illustrations/IllustrationIcons";

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
        setTab((searchParams.get("tab") ?? "overview") as typeof tab);
    }, [searchParams]);

    useEffect(() => {
        if (domainId) getDomain();
    }, [domainId]);

    return domainId ? (
        <div className="h-full p-2 overflow-auto">
            <div className="flex gap-2 items-center">
                <SegmentedControl
                    value={tab ?? undefined}
                    data={[
                        { value: "overview", label: t("common.Overview") },
                        { value: "dns", label: t("dnsRecords.DnsRecords") }
                    ]}
                    onChange={value => router.replace(`/domains?domainId=${domainId}&tab=${value}`)}
                />

                <Tooltip label={t("common.Renew")}>
                    <ActionIcon component="a" href={`https://domene.shop/admin?id=${domainId}&command=renew`} onClick={openInBrowserOnClick()}>
                        <IconRestore />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label={t("other.EditContactInfo")}>
                    <ActionIcon component="a" href={`https://domene.shop/admin?id=${domainId}&edit=contacts`} onClick={openInBrowserOnClick()}>
                        <IconAddressBook />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label={t("domains.EditNameservers")}>
                    <ActionIcon component="a" href={`https://domene.shop/admin?id=${domainId}&edit=ns`} onClick={openInBrowserOnClick()}>
                        <IconCloudComputing />
                    </ActionIcon>
                </Tooltip>

                <Tooltip label={t("other.OrderUpgrade")}>
                    <ActionIcon component="a" href={`https://domene.shop/admin?id=${domainId}&view=upgrade`} onClick={openInBrowserOnClick()}>
                        <IconBolt />
                    </ActionIcon>
                </Tooltip>
            </div>

            <div className="mt-2" aria-live="assertive">
                {tab === "overview" || tab === null ? (
                    <DomainOverviewTab isDomainLoading={isDomainLoading} domain={domain} />
                ) : null}

                {tab === "dns" ? (
                    <DomainDnsTab />
                ) : null}
            </div>
        </div>
    ) : (
        <div className="w-full h-full flex justify-center items-center">
            <IllustrationIcons scale={.75} />
        </div>
    );
};

export default Page;