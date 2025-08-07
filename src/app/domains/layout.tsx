"use client";

import Sidebar from "@/components/common/Sidebar";
import ParentProps from "@/types/common/ParentProps";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import getArrayFromNumber from "@/utils/functions/getArrayFromNumber";
import DomainGetModel from "@/types/domains/DomainGetModel";
import useSearchParam from "@/utils/hooks/useSearchParam";
import Link from "next/link";

import { useEffect } from "react";
import { t } from "i18next";
import { NavLink, Skeleton } from "@mantine/core";

const Layout = ({ children }: ParentProps) => {

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    const {
        isLoading: isDomainsLoading,
        data: domains,
        call: getDomains
    } = useHttpClient<DomainGetModel[]>({
        endpoint: Endpoint.Domains
    });

    useEffect(() => {
        getDomains();
    }, []);

    return (
        <div className="w-full h-full flex">
            <h1 className="sr-only">
                {t("domains.Domains")}
            </h1>

            <Sidebar>
                <nav className="w-full h-full flex flex-col gap-1 overflow-auto" aria-label={t("domains.Domains")}>
                    {isDomainsLoading ? (
                        getArrayFromNumber(domains?.length ?? 15).map(i => (
                            <Skeleton height={40.8} className="rounded-none" key={i} />
                        ))
                    ) : (
                        domains
                            ?.toSorted((a, b) => a.id > b.id ? 1 : -1)
                            .map(domain => (
                            <NavLink
                                component={Link}
                                href={`/domains?domainId=${domain.id}`}
                                active={domainId === domain.id}
                                label={domain.domain}
                                key={domain.id}
                            />
                        ))
                    )}
                </nav>
            </Sidebar>

            <main className="w-0 h-full flex-grow">
                {children}
            </main>
        </div>
    );
};

export default Layout;