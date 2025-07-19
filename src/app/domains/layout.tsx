"use client";

import ParentProps from "@/types/common/ParentProps";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { useEffect } from "react";

const Layout = ({ children }: ParentProps) => {

    const {
        isLoading: isDomainsLoading,
        data: domains,
        call: getDomains
    } = useHttpClient<DomainGetModel[]>({
        endpoint: Endpoint.Domains
    });

    useEffect(() => {
        getDomains().catch(() => {});
    }, []);

    const isEmpty = !isDomainsLoading && !domains;

    return (
        <div className="flex p-2 gap-2">


            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;