"use client";

import Sidebar from "@/components/common/Sidebar";
import ParentProps from "@/types/common/ParentProps";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useWindowTitle from "@/utils/hooks/useWindowTitle";
import getArrayFromNumber from "@/utils/functions/getArrayFromNumber";

import { useEffect } from "react";
import { t } from "i18next";
import { ActionIcon, Button, Paper, Skeleton } from "@mantine/core";
import { useParams } from "next/navigation";
import { IconRefresh } from "@tabler/icons-react";
import Link from "next/link";

const Layout = ({ children }: ParentProps) => {

    const {
        isLoading: isDomainsLoading,
        data: domains,
        call: getDomains
    } = useHttpClient<DomainGetModel[]>({
        endpoint: Endpoint.Domains
    });

    const { domainId } = useParams();

    useEffect(() => {
        getDomains().catch(() => {});
    }, []);

    useWindowTitle({ title: t("domains.Domains") });

    const isEmpty = !isDomainsLoading && !domains;
    const isList = !isDomainsLoading && domains && domains.length > 0;

    return (
        <div className="h-full flex gap-2">
            <Sidebar>
                <div className="w-full h-full overflow-auto relative flex flex-col gap-2">

                    {isEmpty ? (
                        <Button>

                        </Button>
                    ) : null}

                    {isList || isDomainsLoading ? (
                        <ul aria-live="assertive" aria-busy={isDomainsLoading}>
                            {isDomainsLoading ? (
                                getArrayFromNumber(domains?.length ?? 10).map(i => (
                                    <Skeleton key={i} height={36} />
                                ))
                            ) : (
                                domains?.map(domain => (
                                    <li key={domain.id}>
                                        <Button
                                            fullWidth
                                            component={Link}
                                            variant={`${domainId}` === `${domain.id}` ? "light" : "subtle"}
                                            styles={{ inner: { justifyContent: "start" } }}
                                            href={`/domains?domainId=${domain.id}`}>
                                            {domain.domain}
                                        </Button>
                                    </li>
                                ))
                            )}
                        </ul>
                    ) : null}
                </div>
            </Sidebar>

            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;