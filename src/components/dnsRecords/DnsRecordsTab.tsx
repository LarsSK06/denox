"use client";

import { ActionIcon, Button, Checkbox, Menu, Paper, Select, Table, Transition } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { IconDots, IconPencil, IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";

import useSearchParam from "@/utils/hooks/useSearchParam";
import Loader from "../common/Loader";
import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import CreateEditDnsRecordModal from "./CreateEditDnsRecordModal";
import prettifyMoneyAmount from "@/utils/functions/prettifyMoneyAmount";
import useDnsRecordsRepository from "@/utils/repositories/dnsRecordsRepository";

const DnsRecordsTab = () => {
    const [host, setHost] = useState<string | null>(null);
    const [type, setType] = useState<DnsRecordType | null>(null);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    const [showCreateEditDnsRecordModal, setShowCreateEditDnsRecordModal] = useState<boolean>(false);
    const [dnsRecordToEdit, setDnsRecordToEdit] = useState<DnsRecordGetModel | null>(null);

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    const dnsRecordsRepository = useDnsRecordsRepository({ domainId: domainId ?? -1 });
    
    const filteredDnsRecords = useMemo(() =>
        (dnsRecordsRepository.dnsRecords ?? [])
            .filter(r => !host || r.host === host)
            .filter(r => !type || r.type === type)
    , [dnsRecordsRepository.dnsRecords, host, type]);

    useEffect(() => {
        if (!domainId) return;

        dnsRecordsRepository.getDnsRecords();
    }, [domainId]);

    useEffect(() => {
        setSelectedIds(prev => prev.filter(id => filteredDnsRecords?.some(r => r.id === id)));
    }, [filteredDnsRecords]);

    const includePriority = useMemo<boolean>(() => !!filteredDnsRecords?.some(r => r.priority), [filteredDnsRecords]);
    const includeWeight = useMemo<boolean>(() => !!filteredDnsRecords?.some(r => r.weight), [filteredDnsRecords]);
    const includePort = useMemo<boolean>(() => !!filteredDnsRecords?.some(r => r.port), [filteredDnsRecords]);

    return (
        <>
            <CreateEditDnsRecordModal
                show={showCreateEditDnsRecordModal || !!dnsRecordToEdit}
                onClose={() => {
                    setShowCreateEditDnsRecordModal(false);
                    setDnsRecordToEdit(null);
                }}
                dnsRecord={dnsRecordToEdit}
                dnsRecordsRepository={dnsRecordsRepository}
            />

            <div className="w-full h-full relative">
                <Transition mounted={!!dnsRecordsRepository.dnsRecords} exitDuration={0} transition="fade-right">
                    {style => (
                        <div className="w-full h-full p-2 flex items-start flex-col gap-2 overflow-auto" style={style}>
                            <Paper withBorder shadow="sm" className="p-2 flex items-end gap-2" style={{ minWidth: "100%" }}>
                                <Select
                                    label={t("common.Host")}
                                    value={host ?? ""}
                                    onChange={value => setHost(value ? value : null)}
                                    data={[
                                        { value: "", label: t("common.All") },
                                        ...(dnsRecordsRepository.dnsRecords ?? [])
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
                                        ...(dnsRecordsRepository.dnsRecords ?? [])
                                            .reduce((root, current) =>
                                                !root.includes(current.type)
                                                    ? [...root, current.type]
                                                    : root
                                            , [] as DnsRecordType[])
                                            .toSorted((a, b) => a > b ? 1 : -1)
                                    ]}
                                />

                                <ActionIcon size="input-sm" onClick={() => dnsRecordsRepository.getDnsRecords()}>
                                    <IconRefresh />
                                </ActionIcon>
                            </Paper>

                            <div className="flex gap-2">
                                <Button leftSection={<IconPlus />} onClick={() => setShowCreateEditDnsRecordModal(true)}>
                                    {t("dnsRecords.CreateDnsRecord")}
                                </Button>

                                <Transition mounted={selectedIds.length > 0} transition="fade">
                                    {buttonStyle => (
                                        <Button
                                            color="red"
                                            loading={dnsRecordsRepository.isDeleteDnsRecordsLoading}
                                            style={buttonStyle}
                                            leftSection={<IconTrash />}
                                            onClick={() => dnsRecordsRepository.deleteDnsRecords(selectedIds)}>
                                            {t("dnsRecords.DeleteDnsRecords")}
                                        </Button>
                                    )}
                                </Transition>
                            </div>

                            <Paper withBorder shadow="sm" style={{ minWidth: "100%" }}>
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Td className="w-0">
                                                <Checkbox
                                                    indeterminate={
                                                        selectedIds.length < filteredDnsRecords.length &&
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

                                            <Table.Td className="w-0 font-bold">
                                                {t("common.Host")}
                                            </Table.Td>

                                            <Table.Td className="w-0 font-bold">
                                                {t("common.Ttl")}
                                            </Table.Td>

                                            <Table.Td className="w-0 font-bold">
                                                {t("common.Type")}
                                            </Table.Td>

                                            {includePriority ? (
                                                <Table.Td className="w-0 font-bold">
                                                    {t("common.Priority")}
                                                </Table.Td>
                                            ) : null}

                                            {includeWeight ? (
                                                <Table.Td className="w-0 font-bold">
                                                    {t("common.Weight")}
                                                </Table.Td>
                                            ) : null}

                                            {includePort ? (
                                                <Table.Td className="w-0 font-bold">
                                                    {t("common.Port")}
                                                </Table.Td>
                                            ) : null}

                                            <Table.Td className="font-bold">
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
                                                        onChange={() => {
                                                            setSelectedIds(prev =>
                                                                prev.includes(dnsRecord.id)
                                                                    ? prev.filter(id => id !== dnsRecord.id)
                                                                    : [...prev, dnsRecord.id]
                                                            );
                                                        }}
                                                    />
                                                </Table.Td>

                                                <Table.Td>
                                                    {dnsRecord.host}
                                                </Table.Td>

                                                <Table.Td className="text-nowrap">
                                                    {prettifyMoneyAmount(dnsRecord.ttl ?? 0)}
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
                                                            <ActionIcon variant="subtle" disabled={`${dnsRecord.id}`.includes(".")}>
                                                                <IconDots />
                                                            </ActionIcon>
                                                        </Menu.Target>

                                                        <Menu.Dropdown>
                                                            <Menu.Item leftSection={<IconPencil />} onClick={() => setDnsRecordToEdit(dnsRecord)}>
                                                                {t("dnsRecords.EditDnsRecord")}
                                                            </Menu.Item>

                                                            <Menu.Item leftSection={<IconTrash />} onClick={() => dnsRecordsRepository.deleteDnsRecords([dnsRecord.id])} color="red">
                                                                {t("dnsRecords.DeleteDnsRecord")}
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

                <Transition mounted={!dnsRecordsRepository.dnsRecords} transition="fade-right">
                    {style => (
                        <div className="w-full h-full left-0 top-0 flex justify-center items-center absolute" style={style}>
                            <Loader />
                        </div>
                    )}
                </Transition>
            </div>
        </>
    );
};

export default DnsRecordsTab;