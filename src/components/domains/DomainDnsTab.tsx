"use client";

import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useMount from "@/utils/hooks/useMount";
import useSearchParamId from "@/utils/hooks/useSearchParamId";

import { Paper, Select, Skeleton, Table, Transition } from "@mantine/core";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";

type DomainDnsTabProps = {
    isDomainLoading: boolean;
    domain: DomainGetModel | null;
};

const DomainDnsTab = ({ isDomainLoading, domain }: DomainDnsTabProps) => {
    const [type, setType] = useState<DnsRecordType | null>(null);

    const isMounted = useMount();
    const domainId = useSearchParamId({ key: "domainId", type: "number" });

    const {
        isLoading: isDnsRecordsLoading,
        data: dnsRecords,
        call: getDnsRecords
    } = useHttpClient<DnsRecordGetModel[]>({ endpoint: [Endpoint.Domains, domainId, Endpoint.DNS] });

    useEffect(() => {
        if (!domainId) return;

        getDnsRecords();
    }, [domainId]);

    const availableDnsRecordTypes = useMemo(() =>
        dnsRecords
            ?.reduce((root, current) =>
                !root.includes(current.type)
                    ? [...root, current.type]
                    : root    
            , [] as DnsRecordType[])
            .toSorted((a, b) => a > b ? 1 : -1)
    , [dnsRecords]);

    return (
        <div className="w-full flex flex-col gap-2">
            {isDnsRecordsLoading ? (
                <Skeleton height={78.8} />
            ) : (
                <Paper withBorder shadow="sm" className="p-2 flex gap-2">
                    <Select
                        value={type ?? ""}
                        label={t("common.Type")}
                        data={[
                            { value: "", label: t("common.All") },
                            ...availableDnsRecordTypes?.map(t => ({ value: t, label: t })) ?? []
                        ]}
                        onChange={(value) => setType(!value || value === "" ? null : value as DnsRecordType)}
                    />
                </Paper>
            )}

            <Transition mounted={isMounted} transition="fade-up" enterDelay={100}>
                {style => (
                    <Paper withBorder shadow="sm" className="p-2 flex gap-2" style={style}>
                        <Table>

                        </Table>
                    </Paper>
                )}
            </Transition>
        </div>
    );
};

export default DomainDnsTab;