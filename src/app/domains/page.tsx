"use client";

import DomainDnsTab from "@/components/domains/DomainDnsTab";
import DomainOverviewTab from "@/components/domains/DomainOverviewTab";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import IllustrationIcons from "@/components/illustrations/IllustrationIcons";
import useMount from "@/utils/hooks/useMount";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Tabs, Transition } from "@mantine/core";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { t } from "i18next";

const Page = () => {
    const [tab, setTab] = useState<"overview" | "dns">("overview");

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
        <div className="h-full overflow-auto">
            <Transition mounted={isMounted} transition="fade-up" duration={allowAnimations ? undefined : 0}>
                {style => (
                    <div className="flex gap-2 items-center" style={style}>
                        <Tabs className="w-full" value={tab} onChange={value => router.replace(`/domains?domainId=${domainId}&tab=${value}`)}>
                            <Tabs.List className="mb-4">
                                <Tabs.Tab value="overview">
                                    {t("common.Overview")}
                                </Tabs.Tab>

                                <Tabs.Tab value="dns">
                                    {t("dnsRecords.DnsRecords")}
                                </Tabs.Tab>
                            </Tabs.List>
                            
                            <Tabs.Panel value="overview">
                                <DomainOverviewTab isDomainLoading={isDomainLoading} domain={domain} />
                            </Tabs.Panel>

                            <Tabs.Panel value="dns">
                                <DomainDnsTab />
                            </Tabs.Panel>
                        </Tabs>

                        {/* <Menu position="bottom-start">
                            <Menu.Target>
                                <ActionIcon variant="subtle" aria-label={t("common.Actions")}>
                                    <IconDots />
                                </ActionIcon>
                            </Menu.Target>

                            <Menu.Dropdown>
                                <Menu.Item
                                    leftSection={<IconRestore />}
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&command=renew`}
                                    onClick={openInBrowserOnClick()}>
                                    {t("common.Renew")}
                                </Menu.Item>

                                <Menu.Item
                                    leftSection={<IconAddressBook />}
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&edit=contacts`}
                                    onClick={openInBrowserOnClick()}>
                                    {t("other.EditContactInfo")}
                                </Menu.Item>

                                <Menu.Item
                                    leftSection={<IconCloudComputing />}
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&edit=ns`}
                                    onClick={openInBrowserOnClick()}>
                                    {t("domains.EditNameservers")}
                                </Menu.Item>

                                <Menu.Item
                                    leftSection={<IconBolt />}
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&view=upgrade`}
                                    onClick={openInBrowserOnClick()}>
                                    {t("other.OrderUpgrade")}
                                </Menu.Item>
                            </Menu.Dropdown>
                        </Menu> */}
                    </div>
                )}
            </Transition>
        </div>
    ) : (
        <div className="w-full h-full flex justify-center items-center">
            <IllustrationIcons scale={.75} aria-hidden />
        </div>
    );
};

export default Page;