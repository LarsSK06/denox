"use client";

import DomainDnsTab from "@/components/dnsRecords/DomainDnsTab";
import DomainOverviewTab from "@/components/domains/DomainOverviewTab";
import IllustrationIcons from "@/components/illustrations/IllustrationIcons";
import useMount from "@/utils/hooks/useMount";
import DomainForwardsTab from "@/components/forwards/DomainForwardsTab";

import { Tabs, Transition } from "@mantine/core";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { usePositionContext } from "@/utils/contexts/usePositionContext";
import { t } from "i18next";

const Page = () => {
    const isMounted = useMount();

    const { allowAnimations } = useSettingsContext();
    const { domainId, domainTab, setDomainTab } = usePositionContext();

    return domainId ? (
        <div className="h-full overflow-auto">
            <Transition mounted={isMounted} transition="fade-up" duration={allowAnimations ? undefined : 0}>
                {style => (
                    <div className="flex gap-2 items-center" style={style}>
                        <Tabs keepMounted={false} className="w-full" value={domainTab} onChange={value => setDomainTab(value as typeof domainTab)}>
                            <Tabs.List className="mb-4">
                                <Tabs.Tab value="overview">
                                    {t("common.Overview")}
                                </Tabs.Tab>

                                <Tabs.Tab value="dns">
                                    {t("dnsRecords.DnsRecords")}
                                </Tabs.Tab>

                                <Tabs.Tab value="forwards">
                                    {t("forwards.Forwards")}
                                </Tabs.Tab>
                            </Tabs.List>
                            
                            <Tabs.Panel value="overview">
                                <DomainOverviewTab />
                            </Tabs.Panel>

                            <Tabs.Panel value="dns">
                                <DomainDnsTab />
                            </Tabs.Panel>

                            <Tabs.Panel value="forwards">
                                <DomainForwardsTab />
                            </Tabs.Panel>
                        </Tabs>
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