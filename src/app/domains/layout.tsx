"use client";

import Sidebar from "@/components/common/Sidebar";
import DomainNavButton from "@/components/domains/DomainNavButton";
import ParentProps from "@/types/common/ParentProps";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import getArrayFromNumber from "@/utils/functions/getArrayFromNumber";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { useEffect } from "react";
import { Skeleton } from "@mantine/core";
import { t } from "i18next";

const Layout = ({ children }: ParentProps) => {

    const {
        isLoading: isDomainsLoading,
        data: domains,
        call: getDomains
    } = useHttpClient<DomainGetModel[]>({ endpoint: Endpoint.Domains });

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