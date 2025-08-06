"use client";

import Sidebar from "@/components/common/Sidebar";
import DomainNavButton from "@/components/domains/DomainNavButton";
import ParentProps from "@/types/common/ParentProps";
import getArrayFromNumber from "@/utils/functions/getArrayFromNumber";

import { useEffect } from "react";
import { Skeleton } from "@mantine/core";
import { t } from "i18next";
import { useDomainsContext } from "@/utils/contexts/useDomainsContext";

const Layout = ({ children }: ParentProps) => {

    const {
        isDomainsLoading,
        domains,
        getDomains
    } = useDomainsContext();

    useEffect(() => {
        getDomains();
    }, []);

    return (
        <div className="h-full flex">
            <Sidebar>
                <nav className="h-full overflow-auto" aria-label={t("domains.Domains")} aria-busy={isDomainsLoading} aria-live="assertive">
                    {isDomainsLoading ? (
                        getArrayFromNumber(domains?.length ?? 15).map(i => (
                            <Skeleton component="li" className="rounded-none" height={40.8} key={i} />
                        ))
                    ) : (
                        domains?.map((domain, i) => (
                            <DomainNavButton domain={domain} index={i} key={domain.id} />
                        ))
                    )}
                </nav>
            </Sidebar>

            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
};

export default Layout;