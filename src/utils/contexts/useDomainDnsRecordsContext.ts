import useHttpClient from "../hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import ParentProps from "@/types/common/ParentProps";
import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";

import { createContext, createElement, Dispatch, SetStateAction, useContext, useMemo } from "react";
import { usePositionContext } from "./usePositionContext";
import { invalidContextUsageError } from "../globals";

type DomainDnsRecordsContextValue = {
    isDnsRecordsLoading: boolean;
    dnsRecords: DnsRecordGetModel[] | null;
    setDnsRecords: Dispatch<SetStateAction<DnsRecordGetModel[] | null>>;
    getDnsRecords: ReturnType<typeof useHttpClient<DnsRecordGetModel[]>>["call"];
};

const DomainDnsRecordsContext = createContext<DomainDnsRecordsContextValue | undefined>(undefined);

export const DomainDnsRecordsContextProvider = ({ children }: ParentProps) => {
    const { domainId } = usePositionContext();

    const {
        isLoading: isDnsRecordsLoading,
        data: dnsRecords,
        setData: setDnsRecords,
        call: getDnsRecords
    } = useHttpClient<DnsRecordGetModel[]>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS]
    });

    const value = useMemo<DomainDnsRecordsContextValue>(() => ({
        isDnsRecordsLoading,
        dnsRecords,
        setDnsRecords,
        getDnsRecords
    }), [isDnsRecordsLoading, dnsRecords]);

    return createElement(DomainDnsRecordsContext, { value }, children);
};

export const useDomainDnsRecordsContext = () => {
    const context = useContext(DomainDnsRecordsContext);

    if (!context) throw new Error(invalidContextUsageError);

    return context;
};