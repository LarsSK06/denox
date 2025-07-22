"use client";

import Check from "@/components/common/Check";
import DomainStatusChip from "@/components/domains/DomainStatusChip";
import IllustrationIcons from "@/components/illustrations/IllustrationIcons";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";
import prettifyDate from "@/utils/functions/prettifyDate";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import useWindowTitle from "@/utils/hooks/useWindowTitle";
import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import TableBodySkeleton from "@/components/common/TableBodySkeleton";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";

import { ActionIcon, Button, Checkbox, Paper, SemiCircleProgress, Skeleton, Table, Text } from "@mantine/core";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IconAlertCircle, IconExternalLink, IconTrash, IconX } from "@tabler/icons-react";
import { t } from "i18next";
import { notifications } from "@mantine/notifications";
import DomainPeriodProgressCircle from "@/components/domains/DomainPeriodProgressCircle";
import DomainBasicDataContainer from "@/components/domains/DomainBasicDataContainer";

const Page = () => {
    const [selectedDnsRecordIds, setSelectedDnsRecordIds] = useState<number[]>([]);
    const [isDeleteDnsRecordsLoading, setIsDeleteDnsRecordsLoading] = useState<boolean>(false);

    const domainId = useSearchParamId({ key: "domainId", type: "number" });
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const {
        isLoading: isDomainLoading,
        data: domain,
        call: getDomain
    } = useHttpClient<DomainGetModel>({
        endpoint: [Endpoint.Domains, domainId],
        process: body => ({
            ...body,
            registeredDate: new Date(body.registeredDate),
            expiryDate: new Date(body.expiryDate)
        })
    });

    const {
        isLoading: isDnsRecordsLoading,
        data: dnsRecords,
        setData: setDnsRecords,
        call: getDnsRecords
    } = useHttpClient<DnsRecordGetModel[]>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS]
    });

    const { call: deleteDnsRecord } = useHttpClient<DnsRecordGetModel[]>(dnsRecordId => ({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS, dnsRecordId],
        method: "DELETE"
    }));

    useEffect(() => {
        if (!domainId) return;

        getDomain();
        getDnsRecords();
    }, [domainId]);

    useEffect(() => {
        if (!dnsRecords) return;

        setSelectedDnsRecordIds(selectedDnsRecordIds.filter(id => dnsRecords.some(r => r.id === id)));
    }, [dnsRecords]);

    useWindowTitle({ title: !domain || isDomainLoading ? "..." : domain.domain });

    const domainPeriodElapsedPercentage = useMemo(() => {
        if (!domain) return 0;

        const registeredDateMs = domain.registeredDate.getTime();
        const expiryDateMs = domain.expiryDate.getTime();
        const nowMs = new Date().getTime();
        
        const rdmsToEdms = expiryDateMs - registeredDateMs;
        const rdmsToNms = nowMs - registeredDateMs;

        return Math.round((rdmsToNms / rdmsToEdms) * 100);
    }, [domain]);

    const handleDeleteSelectedDnsRecords = () => {
        setIsDeleteDnsRecordsLoading(true);

        setDnsRecords(dnsRecords?.filter(r => !selectedDnsRecordIds.includes(r.id)) ?? []);

        Promise.allSettled(selectedDnsRecordIds.map(dnsRecordId =>
            deleteDnsRecord(dnsRecordId).catch(error => {
                notifications.show({
                    title: t("dnsRecords.DeleteDnsRecordError"),
                    message: `${error}`,
                    color: "red",
                    icon: <IconAlertCircle />
                });

                setDnsRecords(prev => [
                    ...prev!,
                    dnsRecords?.find(r => r.id === dnsRecordId)!
                ]);
            })
        )).finally(() => setIsDeleteDnsRecordsLoading(false));
    };

    const showPriorityColInDnsRecordsTable = dnsRecords?.some(r => [DnsRecordType.MX, DnsRecordType.SRV].includes(r.type));
    const showWeightAndPortColsInDnsRecordsTable = dnsRecords?.some(r => r.type === DnsRecordType.SRV);

    return (
        <div className="w-full h-full relative overflow-auto">
            {domainId ? (
                <Paper withBorder className="p-1 flex absolute top-4 right-4">
                    <ActionIcon variant="transparent" onClick={() => {
                        const before = new URLSearchParams(searchParams);

                        before.delete("domainId");
                        router.push(`${pathname}?${before}`);
                    }}>
                        <IconX />
                    </ActionIcon>
                </Paper>
            ) : null}

            {domainId ? (
                <div className="p-4 flex flex-col gap-8 overflow-auto">
                    <DomainPeriodProgressCircle isDomainLoading={isDomainLoading} domain={domain} />

                    <div className="mx-auto">
                        {!isDomainLoading && domain ? (
                            <DomainStatusChip status={domain.status} />
                        ) : (
                            <Skeleton width={80} height={34.8} className="rounded-full" />
                        )}
                    </div>

                    <DomainBasicDataContainer isDomainLoading={isDomainLoading} domain={domain} />

                    <Paper withBorder shadow="sm" className="p-4 flex items-start flex-col gap-2 overflow-auto" style={{ width: "100%" }}>
                        <Button
                            className="transition-colors"
                            color="red"
                            leftSection={<IconTrash />}
                            disabled={selectedDnsRecordIds.length === 0}
                            onClick={() => handleDeleteSelectedDnsRecords()}
                            loading={isDeleteDnsRecordsLoading}>
                            {t("dnsRecords.DeleteDnsRecords", { count: selectedDnsRecordIds.length })}
                        </Button>

                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Td className="w-0">
                                        <Checkbox
                                            indeterminate={
                                                selectedDnsRecordIds.length !== 0 &&
                                                selectedDnsRecordIds.length !== dnsRecords?.length
                                            }
                                            checked={selectedDnsRecordIds.length === dnsRecords?.length}
                                            onChange={() => {
                                                if (selectedDnsRecordIds.length === 0)
                                                    setSelectedDnsRecordIds(dnsRecords?.map(r => r.id) ?? []);
                                                else setSelectedDnsRecordIds([]);
                                            }}
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

                                    {showPriorityColInDnsRecordsTable ? (
                                        <Table.Td className="w-0 font-bold">
                                            {t("common.Priority")}
                                        </Table.Td>
                                    ) : null}

                                    {showWeightAndPortColsInDnsRecordsTable ? (
                                        <>
                                            <Table.Td className="w-0 font-bold">
                                                {t("common.Weight")}
                                            </Table.Td>

                                            <Table.Td className="w-0 font-bold">
                                                {t("common.Port")}
                                            </Table.Td>
                                        </>
                                    ) : null}

                                    <Table.Td className="font-bold">
                                        {t("common.Data")}
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {isDnsRecordsLoading ? (
                                    <TableBodySkeleton rows={dnsRecords?.length ?? 5} columns={6} />
                                ) : (
                                    dnsRecords
                                        ?.toSorted((a, b) => a.host > b.host ? 1 : -1)
                                        .map(dnsRecord => (
                                        <Table.Tr key={dnsRecord.id}>
                                            <Table.Td>
                                                <Checkbox
                                                    checked={selectedDnsRecordIds.includes(dnsRecord.id)}
                                                    onChange={() => {
                                                        if (selectedDnsRecordIds.includes(dnsRecord.id))
                                                            setSelectedDnsRecordIds(selectedDnsRecordIds.filter(id => id !== dnsRecord.id));
                                                        else setSelectedDnsRecordIds([...selectedDnsRecordIds, dnsRecord.id]);
                                                    }}
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

                                            {showPriorityColInDnsRecordsTable ? (
                                                <Table.Td>
                                                    {dnsRecord.priority}
                                                </Table.Td>
                                            ) : null}

                                            {showWeightAndPortColsInDnsRecordsTable ? (
                                                <>
                                                    <Table.Td>
                                                        {dnsRecord.weight}
                                                    </Table.Td>

                                                    <Table.Td>
                                                        {dnsRecord.port}
                                                    </Table.Td>
                                                </>
                                            ) : null}

                                            <Table.Td>
                                                {dnsRecord.data}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                )}
                            </Table.Tbody>
                        </Table>
                    </Paper>

                    <figure>
                        <Text component="figcaption" size="xl">
                            {t("common.QuickActions")}
                        </Text>

                        <ul className="mt-2 flex gap-2">
                            <li>
                                <Button
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&command=renew`}
                                    rightSection={<IconExternalLink />}
                                    onClick={openInBrowserOnClick()}>
                                    {t("common.Renew")}
                                </Button>
                            </li>
                        </ul>
                    </figure>
                </div>
            ) : (
                <div className="w-full h-full flex justify-center items-center">
                    <IllustrationIcons scale={.5} />
                </div>
            )}
        </div>
    );
};

export default Page;