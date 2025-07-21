"use client";

import Link from "next/link";
import Sidebar from "@/components/common/Sidebar";
import ParentProps from "@/types/common/ParentProps";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useWindowTitle from "@/utils/hooks/useWindowTitle";
import getArrayFromNumber from "@/utils/functions/getArrayFromNumber";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import useCache from "@/utils/hooks/useCache";

import { t } from "i18next";
import { useEffect, useState } from "react";
import { Button, Divider, Skeleton, Transition } from "@mantine/core";
import { IconExternalLink } from "@tabler/icons-react";

const Layout = ({ children }: ParentProps) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    const {
        isLoading: isDomainsLoading,
        data: domains,
        call: getDomains
    } = useHttpClient<DomainGetModel[]>({
        endpoint: Endpoint.Domains
    });

    const domainId = useSearchParamId({ key: "domainId", type: "number" });

    useEffect(() => {
        getDomains();
        setIsMounted(true);
    }, []);

    useWindowTitle({ title: t("domains.Domains") });

    return (
        <div className="h-full flex gap-2">
            <Sidebar minWidth={200}>
                <div className="w-full h-full overflow-auto relative flex flex-col gap-2">
                    <div className="w-full">
                        <ul aria-live="assertive" aria-busy={isDomainsLoading}>
                            {isDomainsLoading ? (
                                getArrayFromNumber(domains?.length ?? 10).map(i => (
                                    <Skeleton key={i} height={36} />
                                ))
                            ) : (
                                domains?.map((domain, i) => (
                                    <Transition mounted={isMounted} key={domain.id} enterDelay={i * 100}>
                                        {style => (
                                            <li key={domain.id} style={style}>
                                                <Button
                                                    fullWidth
                                                    component={Link}
                                                    variant={`${domainId}` === `${domain.id}` ? "light" : "subtle"}
                                                    styles={{ inner: { justifyContent: "start" } }}
                                                    href={`/domains?domainId=${domain.id}`}>
                                                    {domain.domain}
                                                </Button>
                                            </li>
                                        )}
                                    </Transition>
                                ))
                            )}
                        </ul>

                        <Divider />

                        <Button
                            className="m-2"
                            component={Link}
                            href="https://domene.shop"
                            rightSection={<IconExternalLink />}
                            onClick={openInBrowserOnClick()}>
                            {t("domains.PurchaseDomains")}
                        </Button>
                    </div>
                </div>
            </Sidebar>

            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
};

export default Layout;