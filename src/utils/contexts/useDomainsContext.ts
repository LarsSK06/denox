import useHttpClient from "../hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import ParentProps from "@/types/common/ParentProps";
import DomainGetModel from "@/types/domains/DomainGetModel";

import { createContext, createElement, Dispatch, SetStateAction, useContext, useMemo } from "react";
import { invalidContextUsageError } from "../globals";

type DomainsContextValue = {
    isDomainsLoading: boolean;
    domains: DomainGetModel[] | null;
    setDomains: Dispatch<SetStateAction<DomainGetModel[] | null>>;
    getDomains: ReturnType<typeof useHttpClient<DomainGetModel[]>>["call"];
};

const DomainsContext = createContext<DomainsContextValue | undefined>(undefined);

export const DomainsContextProvider = ({ children }: ParentProps) => {
    const {
        isLoading: isDomainsLoading,
        data: domains,
        setData: setDomains,
        call: getDomains
    } = useHttpClient<DomainGetModel[]>({
        endpoint: Endpoint.Domains
    });

    const value = useMemo<DomainsContextValue>(() => ({
        isDomainsLoading,
        domains,
        setDomains,
        getDomains
    }), [isDomainsLoading, domains]);

    return createElement(DomainsContext, { value }, children);
};

export const useDomainsContext = () => {
    const context = useContext(DomainsContext);

    if (!context) throw new Error(invalidContextUsageError);

    return context;
};