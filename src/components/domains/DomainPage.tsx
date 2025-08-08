"use client";

import DomainOverviewTab from "./DomainOverviewTab";

import { SegmentedControl } from "@mantine/core";
import { t } from "i18next";
import { useState } from "react";

type Tab =
    "overview" |
    "dns" |
    "forwards";

const DomainPage = () => {
    const [tab, setTab] = useState<Tab>("overview");

    return (
        <main className="w-full h-full p-2 flex items-start flex-col overflow-hidden" aria-live="assertive">
            <SegmentedControl
                value={tab}
                onChange={value => setTab(value as typeof tab)}
                data={[
                    { value: "overview", label: t("common.Overview") },
                    { value: "dns", label: t("dnsRecords.DnsRecords") },
                    { value: "forwards", label: t("forwards.Forwards") }
                ]}
            />
            
            <main className="w-full h-0 mt-1 flex-grow">
                {tab === "overview" ? (
                    <DomainOverviewTab />
                ) : null}
            </main>
        </main>
    );
};

export default DomainPage;