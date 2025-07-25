"use client";

import Sidebar from "@/components/common/Sidebar";
import DomainNavButton from "@/components/domains/DomainNavButton";
import ParentProps from "@/types/common/ParentProps";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import getArrayFromNumber from "@/utils/functions/getArrayFromNumber";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { Skeleton } from "@mantine/core";
import { useEffect } from "react";

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
                <ul>
                    {isDomainsLoading ? (
                        getArrayFromNumber(15).map(i => (
                            <Skeleton component="li" key={i} />
                        ))
                    ) : (
                        domains?.map((domain, i) => (
                            <DomainNavButton domain={domain} index={i} key={domain.id} />
                        ))
                    )}
                </ul>
            </Sidebar>

            <main className="flex-grow">
                {children}
            </main>
        </div>
    );
};

export default Layout;