"use client";

import { ActionIcon, Checkbox, Menu, Paper, Select, Table, Transition } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { IconDots } from "@tabler/icons-react";
import { t } from "i18next";

import useSearchParam from "@/utils/hooks/useSearchParam";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import Loader from "../common/Loader";
import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";

const DnsRecordsTab = () => {
    const [host, setHost] = useState<string | null>(null);
    const [type, setType] = useState<DnsRecordType | null>(null);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    const {
        data: dnsRecords,
        call: getDnsRecords
    } = useHttpClient<DnsRecordGetModel[]>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS]
    });
    
    const filteredDnsRecords = useMemo(() =>
        (dnsRecords ?? [])
            .filter(r => !host || r.host === host)
            .filter(r => !type || r.type === type)
    , [dnsRecords, host, type]);

    useEffect(() => {
        if (!domainId) return;

        getDnsRecords();
    }, [domainId]);

    useEffect(() => {
        setSelectedIds(prev => prev.filter(id => filteredDnsRecords?.some(r => r.id === id)));
    }, [filteredDnsRecords]);

    const includePriority = useMemo<boolean>(() => !!filteredDnsRecords?.some(r => r.priority), [filteredDnsRecords]);
    const includeWeight = useMemo<boolean>(() => !!filteredDnsRecords?.some(r => r.weight), [filteredDnsRecords]);
    const includePort = useMemo<boolean>(() => !!filteredDnsRecords?.some(r => r.port), [filteredDnsRecords]);

    return (
        <div className="w-full h-full relative">
            <Transition mounted={!!dnsRecords} transition="fade-right">
                {style => (
                    <div className="w-full h-full p-2 flex items-start flex-col gap-2 overflow-auto" style={style}>
                        <Paper withBorder shadow="sm" className="p-2 flex gap-2">
                            <Select
                                label={t("common.Host")}
                                value={host ?? ""}
                                onChange={value => setHost(value ? value : null)}
                                data={[
                                    { value: "", label: t("common.All") },
                                    ...(dnsRecords ?? [])
                                        .reduce((root, current) =>
                                            !root.includes(current.host)
                                                ? [...root, current.host]
                                                : root
                                        , [] as string[])
                                        .toSorted((a, b) => a > b ? 1 : -1)
                                ]}
                            />

                            <Select
                                label={t("common.Type")}
                                value={type ?? ""}
                                onChange={value => setType(value ? (value as DnsRecordType) : null)}
                                data={[
                                    { value: "", label: t("common.All") },
                                    ...(dnsRecords ?? [])
                                        .reduce((root, current) =>
                                            !root.includes(current.type)
                                                ? [...root, current.type]
                                                : root
                                        , [] as DnsRecordType[])
                                        .toSorted((a, b) => a > b ? 1 : -1)
                                ]}
                            />
                        </Paper>

                        <Paper withBorder shadow="sm" className="w-full">
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Td className="w-0">
                                            <Checkbox
                                                indeterminate={
                                                    selectedIds.length <= filteredDnsRecords.length &&
                                                    selectedIds.length > 0
                                                }
                                                checked={selectedIds.length >= filteredDnsRecords.length}
                                                onChange={() =>
                                                    setSelectedIds(
                                                        selectedIds.length === 0
                                                            ? filteredDnsRecords.map(r => r.id)
                                                            : []
                                                    )
                                                }
                                            />
                                        </Table.Td>

                                        <Table.Td className="w-0">
                                            {t("common.Host")}
                                        </Table.Td>

                                        <Table.Td className="w-0">
                                            {t("common.Ttl")}
                                        </Table.Td>

                                        <Table.Td className="w-0">
                                            {t("common.Type")}
                                        </Table.Td>

                                        {includePriority ? (
                                            <Table.Td className="w-0">
                                                {t("common.Priority")}
                                            </Table.Td>
                                        ) : null}

                                        {includeWeight ? (
                                            <Table.Td className="w-0">
                                                {t("common.Weight")}
                                            </Table.Td>
                                        ) : null}

                                        {includePort ? (
                                            <Table.Td className="w-0">
                                                {t("common.Port")}
                                            </Table.Td>
                                        ) : null}

                                        <Table.Td>
                                            {t("common.Data")}
                                        </Table.Td>

                                        <Table.Td className="w-0">
                                            <span className="sr-only">
                                                {t("common.Actions")}
                                            </span>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Thead>

                                <Table.Tbody>
                                    {filteredDnsRecords
                                        .toSorted((a, b) => a.id > b.id ? 1 : -1)
                                        .map(dnsRecord => (
                                        <Table.Tr key={dnsRecord.id}>
                                            <Table.Td>
                                                <Checkbox
                                                    checked={selectedIds.includes(dnsRecord.id)}
                                                    onChange={() =>
                                                        setSelectedIds(prev =>
                                                            prev.includes(dnsRecord.id)
                                                                ? prev.filter(id => id !== dnsRecord.id)
                                                                : [...prev, dnsRecord.id]
                                                        )
                                                    }
                                                />
                                            </Table.Td>

                                            <Table.Td>
                                                {dnsRecord.host}
                                            </Table.Td>

                                            <Table.Td>
                                                {dnsRecord.ttl}
                                            </Table.Td>

                                            <Table.Td>
                                                {dnsRecord.type}
                                            </Table.Td>

                                            {includePriority ? (
                                                <Table.Td>
                                                    {dnsRecord.priority}
                                                </Table.Td>
                                            ) : null}

                                            {includeWeight ? (
                                                <Table.Td>
                                                    {dnsRecord.weight}
                                                </Table.Td>
                                            ) : null}

                                            {includePort ? (
                                                <Table.Td>
                                                    {dnsRecord.port}
                                                </Table.Td>
                                            ) : null}

                                            <Table.Td>
                                                {dnsRecord.data}
                                            </Table.Td>

                                            <Table.Td>
                                                <Menu>
                                                    <Menu.Target>
                                                        <ActionIcon variant="subtle">
                                                            <IconDots />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item>

                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Paper>
                    </div>
                )}
            </Transition>

            <Transition mounted={!dnsRecords} transition="fade-right">
                {style => (
                    <div className="w-full h-full left-0 top-0 flex justify-center items-center absolute" style={style}>
                        <Loader />
                    </div>
                )}
            </Transition>
        </div>
    );
};

export default DnsRecordsTab;