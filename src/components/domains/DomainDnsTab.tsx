"use client";

import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useSearchParamId from "@/utils/hooks/useSearchParamId";

import { ActionIcon, Pagination, Paper, Select, Table, Text, TextInput, Transition } from "@mantine/core";
import { IconPencil, IconRefresh, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { t } from "i18next";

const DomainDnsTab = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [type, setType] = useState<DnsRecordType | null>(null);
    const [host, setHost] = useState<string | null>(null);

    const { paginateDnsRecords } = useSettingsContext();

    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNumber, setPageNumber] = useState<number>(0);

    const domainId = useSearchParamId({ key: "domainId", type: "number" });

    const {
        isLoading: isDnsRecordsLoading,
        data: dnsRecords,
        call: getDnsRecords
    } = useHttpClient<DnsRecordGetModel[]>({ endpoint: [Endpoint.Domains, domainId, Endpoint.DNS] });

    const filteredDnsRecords =
        (dnsRecords ?? [])
            .filter(r =>
                searchText.trim() === "" ||
                r.data.toLowerCase().includes(searchText.toLowerCase()) ||
                r.host.toLowerCase().includes(searchText.toLowerCase())
            )
            .filter(r => type === null || r.type === type)
            .filter(r => host === null || r.host === host)

    const paginatedDnsRecords =
        filteredDnsRecords
            .filter((_, i) => !paginateDnsRecords || (
                i >= (pageNumber * pageSize) &&
                i < ((pageNumber + 1) * pageSize)
            ));

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

    const availableHosts = useMemo(() =>
        dnsRecords
            ?.reduce((root, current) =>
                !root.includes(current.host)
                    ? [...root, current.host]
                    : root
            , [] as string[])
            .toSorted((a, b) => a > b ? 1 : -1)
    , [dnsRecords]);

    const { allowAnimations } = useSettingsContext();

    return (
        <Transition mounted={!isDnsRecordsLoading} transition="fade-up" exitDuration={0} duration={allowAnimations ? undefined : 0}>
            {style => (
                <div className="w-full flex flex-col gap-2" style={style}>
                    <Paper withBorder shadow="sm" className="p-2 flex items-end gap-2">
                        <TextInput
                            label={t("common.Search")}
                            placeholder={`${t("common.Search")}...`}
                            value={searchText}
                            onChange={event => setSearchText(event.currentTarget.value)}
                        />

                        <Select
                            searchable
                            value={type ?? ""}
                            label={t("common.Type")}
                            data={[
                                { value: "", label: t("common.All") },
                                ...availableDnsRecordTypes?.map(t => ({ value: t, label: t })) ?? []
                            ]}
                            onChange={(value) => setType(!value || value === "" ? null : value as DnsRecordType)}
                        />

                        <Select
                            searchable
                            value={host ?? ""}
                            label={t("common.Host")}
                            data={[
                                { value: "", label: t("common.All") },
                                ...availableHosts?.map(t => ({ value: t, label: t })) ?? []
                            ]}
                            onChange={(value) => setHost(!value || value === "" ? null : value)}
                        />

                        <ActionIcon size="input-sm" variant="subtle" onClick={() => getDnsRecords()}>
                            <IconRefresh />
                        </ActionIcon>
                    </Paper>

                    {/* {paginateDnsRecords ? (
                        <Select
                            className="w-fit"
                            label={t("common.PageSize")}
                            value={`${pageSize}`}
                            data={["3", "5", "10", "15", "20"]}
                            onChange={value => setPageSize(Number(value) ?? pageSize)}
                        />
                    ) : null} */}

                    <ul className="flex flex-col gap-2">
                        {paginatedDnsRecords.map(dnsRecord => (
                            <Paper withBorder shadow="sm" component="li" className="flex p-2 gap-4" key={dnsRecord.id}>
                                <Table>
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Th className="w-24">
                                                {t("common.Host")}
                                            </Table.Th>

                                            <Table.Td>
                                                {dnsRecord.host}
                                            </Table.Td>
                                        </Table.Tr>

                                        <Table.Tr>
                                            <Table.Th className="w-24">
                                                {t("common.Ttl")}
                                            </Table.Th>

                                            <Table.Td>
                                                {dnsRecord.ttl}
                                            </Table.Td>
                                        </Table.Tr>

                                        <Table.Tr>
                                            <Table.Th className="w-24">
                                                {t("common.Type")}
                                            </Table.Th>

                                            <Table.Td>
                                                {dnsRecord.type}
                                            </Table.Td>
                                        </Table.Tr>

                                        <Table.Tr>
                                            <Table.Th className="w-24">
                                                {t("common.Data")}
                                            </Table.Th>

                                            <Table.Td>
                                                {dnsRecord.data}
                                            </Table.Td>
                                        </Table.Tr>

                                        {dnsRecord.priority ? (
                                            <Table.Tr>
                                                <Table.Th className="w-24">
                                                    {t("common.Priority")}
                                                </Table.Th>

                                                <Table.Td>
                                                    {dnsRecord.priority}
                                                </Table.Td>
                                            </Table.Tr>
                                        ) : null}

                                        {dnsRecord.weight ? (
                                            <Table.Tr>
                                                <Table.Th className="w-24">
                                                    {t("common.Weight")}
                                                </Table.Th>

                                                <Table.Td>
                                                    {dnsRecord.weight}
                                                </Table.Td>
                                            </Table.Tr>
                                        ) : null}

                                        {dnsRecord.port ? (
                                            <Table.Tr>
                                                <Table.Th className="w-24">
                                                    {t("common.Port")}
                                                </Table.Th>

                                                <Table.Td>
                                                    {dnsRecord.port}
                                                </Table.Td>
                                            </Table.Tr>
                                        ) : null}
                                    </Table.Tbody>
                                </Table>

                                <div className="flex items-center">
                                    <div className="flex flex-col">
                                        <ActionIcon variant="subtle">
                                            <IconPencil />
                                        </ActionIcon>

                                        <ActionIcon variant="subtle" color="red">
                                            <IconTrash />
                                        </ActionIcon>
                                    </div>
                                </div>
                            </Paper>
                        ))}
                    </ul>

                    {paginateDnsRecords ? (
                        <Pagination
                            total={Math.ceil(filteredDnsRecords.length / pageSize)}
                            value={pageNumber + 1}
                            onChange={value => setPageNumber(value - 1)}
                        />
                    ) : null}
                </div>
            )}
        </Transition>
    );
};

export default DomainDnsTab;