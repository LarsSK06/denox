"use client";

import DomainDnsTab from "@/components/domains/DomainDnsTab";
import DomainOverviewTab from "@/components/domains/DomainOverviewTab";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";
import IllustrationIcons from "@/components/illustrations/IllustrationIcons";
import useMount from "@/utils/hooks/useMount";

import { IconAddressBook, IconBolt, IconCloudComputing, IconRestore } from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ActionIcon, SegmentedControl, Tooltip, Transition } from "@mantine/core";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { t } from "i18next";

const Page = () => {
    const [tab, setTab] = useState<"overview" | "dns" | null>("overview");

    const searchParams = useSearchParams();
    const router = useRouter();
    const domainId = useSearchParamId({ key: "domainId", type: "number" });
    const isMounted = useMount();

    const { allowAnimations } = useSettingsContext();

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
            <Transition mounted={isMounted} transition="fade-up" duration={allowAnimations ? undefined : 0}>
                {style => (
                    <div className="flex gap-2 items-center" style={style}>
                        <SegmentedControl
                            value={tab ?? undefined}
                            data={[
                                { value: "overview", label: t("common.Overview") },
                                { value: "dns", label: t("dnsRecords.DnsRecords") }
                            ]}
                            onChange={value => router.replace(`/domains?domainId=${domainId}&tab=${value}`)}
                        />

                        <Tooltip label={t("common.Renew")}>
                            <ActionIcon variant="subtle" component="a" href={`https://domene.shop/admin?id=${domainId}&command=renew`} onClick={openInBrowserOnClick()}>
                                <IconRestore />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t("other.EditContactInfo")}>
                            <ActionIcon variant="subtle" component="a" href={`https://domene.shop/admin?id=${domainId}&edit=contacts`} onClick={openInBrowserOnClick()}>
                                <IconAddressBook />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t("domains.EditNameservers")}>
                            <ActionIcon variant="subtle" component="a" href={`https://domene.shop/admin?id=${domainId}&edit=ns`} onClick={openInBrowserOnClick()}>
                                <IconCloudComputing />
                            </ActionIcon>
                        </Tooltip>

                        <Tooltip label={t("other.OrderUpgrade")}>
                            <ActionIcon variant="subtle" component="a" href={`https://domene.shop/admin?id=${domainId}&view=upgrade`} onClick={openInBrowserOnClick()}>
                                <IconBolt />
                            </ActionIcon>
                        </Tooltip>
                    </div>
                )}
            </Transition>

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