"use client";

import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import DomainDnsRecordCard from "./DomainDnsRecordCard";
import CreateEditDnsRecordModal from "./CreateEditDnsRecordModal";

import { ActionIcon, Button, Pagination, Paper, Select, TextInput, Transition } from "@mantine/core";
import { IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { t } from "i18next";
import { usePositionContext } from "@/utils/contexts/usePositionContext";

const DomainDnsTab = () => {
    const [searchText, setSearchText] = useState<string>("");
    const [type, setType] = useState<DnsRecordType | null>(null);
    const [host, setHost] = useState<string | null>(null);

    const { paginateDnsRecords } = useSettingsContext();

    const [pageSize, setPageSize] = useState<number>(5);
    const [pageNumber, setPageNumber] = useState<number>(0);

    const [isQuickEditMode, setIsQuickEditMode] = useState<boolean>(false);

    const [showCreateEditDnsRecordModal, setShowCreateEditDnsRecordModal] = useState<boolean>(false);
    const [dnsRecordToEdit, setDnsRecordToEdit] = useState<DnsRecordGetModel | null>(null);

    const { domainId } = usePositionContext();

    const {
        data: dnsRecords,
        setData: setDnsRecords,
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
        if (!domainId) setDnsRecords(null);
        else getDnsRecords();

        return () => setDnsRecords(null);
    }, [domainId]);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Control") return;

            setIsQuickEditMode(true);
        };

        const onKeyUp = (event: KeyboardEvent) => {
            if (event.key !== "Control") return;

            setIsQuickEditMode(false);
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);

        return () => {
            window.removeEventListener("keydown", onKeyDown);
            window.removeEventListener("keyup", onKeyUp);
        };
    }, []);

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
        <>
            <CreateEditDnsRecordModal
                show={showCreateEditDnsRecordModal || !!dnsRecordToEdit}
                domainId={domainId ?? 0}
                dnsRecord={dnsRecordToEdit}
                refresh={() => getDnsRecords()}
                onClose={() => {
                    setShowCreateEditDnsRecordModal(false);
                    setDnsRecordToEdit(null);
                }}
            />

            <Transition mounted={!!dnsRecords} transition="fade-up" exitDuration={0} duration={allowAnimations ? undefined : 0}>
                {style => (
                    <div className="w-full p-2 flex flex-col gap-2" style={style}>
                        <Paper withBorder shadow="sm" className="p-2 flex items-end gap-2">
                            <TextInput
                                label={t("common.Search")}
                                placeholder={`${t("common.Search")}...`}
                                value={searchText}
                                onChange={event => setSearchText(event.currentTarget.value)}
                            />

                            <Select
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

                        <div className="flex gap-2">
                            <Button leftSection={<IconPlus />} onClick={() => setShowCreateEditDnsRecordModal(true)}>
                                {t("dnsRecords.NewDnsRecord")}
                            </Button>
                        </div>

                        <ul className="flex flex-col gap-2">
                            {paginatedDnsRecords.map(dnsRecord => (
                                <DomainDnsRecordCard
                                    dnsRecord={dnsRecord}
                                    isQuickEditMode={isQuickEditMode}
                                    key={dnsRecord.id}
                                    setDnsRecordToEdit={setDnsRecordToEdit}
                                />
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
        </>
    );
};

export default DomainDnsTab;