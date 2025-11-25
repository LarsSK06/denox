"use client";

import DomainOverviewTab from "./DomainOverviewTab";
import DnsRecordsTab from "../dnsRecords/DnsRecordsTab";
import ForwardsTab from "../forwards/ForwardsTab";

import { Tabs } from "@mantine/core";
import { t } from "i18next";
import { useState } from "react";

type Tab =
    "overview" |
    "dns" |
    "forwards";

const DomainPage = () => {
    const [tab, setTab] = useState<Tab>("overview");

    return (
        <main className="w-full h-full flex items-start flex-col">
            <Tabs
                keepMounted={false}
                value={tab}
                onChange={value => setTab(value ? (value as Tab) : "overview")}
                className="w-full h-full mt-1 flex items-start flex-col">
                <Tabs.List className="w-full h-fit">
                    <Tabs.Tab value={"overview" satisfies Tab}>
                        {t("common.Overview")}
                    </Tabs.Tab>

                    <Tabs.Tab value={"dns" satisfies Tab}>
                        {t("dnsRecords.DnsRecords")}
                    </Tabs.Tab>

                    <Tabs.Tab value={"forwards" satisfies Tab}>
                        {t("forwards.Forwards")}
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value={"overview" satisfies Tab} className="w-full h-0 flex-grow overflow-auto">
                    <DomainOverviewTab />
                </Tabs.Panel>

                <Tabs.Panel value={"dns" satisfies Tab} className="w-full h-0 flex-grow overflow-auto">
                    <DnsRecordsTab />
                </Tabs.Panel>

                <Tabs.Panel value={"forwards" satisfies Tab} className="w-full h-0 flex-grow overflow-auto">
                    <ForwardsTab />
                </Tabs.Panel>
            </Tabs>
        </main>
    );
};

export default DomainPage;