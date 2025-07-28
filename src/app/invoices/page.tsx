"use client";

import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import InvoiceGetModel from "@/types/invoices/InvoiceGetModel";
import translateInvoiceType from "@/utils/functions/translateInvoiceType";
import prettifyMoneyAmount from "@/utils/functions/prettifyMoneyAmount";
import prettifyDate from "@/utils/functions/prettifyDate";
import InvoiceStatus from "@/types/invoices/InvoiceStatus";
import InvoiceType from "@/types/invoices/InvoiceType";
import translateInvoiceStatus from "@/utils/functions/translateInvoiceStatus";
import InvoiceStatusChip from "@/components/invoices/InvoiceStatusChip";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";

import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { ActionIcon, Menu, Modal, Paper, RangeSlider, Select, Table, Transition } from "@mantine/core";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { IconCoins, IconDots, IconExternalLink, IconPdf, IconWorldWww } from "@tabler/icons-react";
import { t } from "i18next";

const Page = () => {
    const [type, setType] = useState<InvoiceType | null>(null);
    const [status, setStatus] = useState<InvoiceStatus | null>(null);
    const [minAmount, setMinAmount] = useState<number>(-9999);
    const [maxAmount, setMaxAmount] = useState<number>(9999);

    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    
    const {
        isLoading: isInvoicesLoading,
        data: invoices,
        call: getInvoices
    } = useHttpClient<InvoiceGetModel[]>({
        endpoint: Endpoint.Invoices,
        process: body => (body as any[]).map(i => ({
            ...i,
            dueDate: i.dueDate && new Date(i.dueDate),
            issuedDate: new Date(i.issuedDate),
            paidDate: i.paidDate && new Date(i.paidDate)
        } as InvoiceGetModel))
    });

    const availableInvoiceTypes = useMemo<NonNullable<ComponentProps<typeof Select>["data"]>>(() =>
        (invoices ?? [])
            .reduce((root, current) =>
                !root.includes(current.type)
                    ? [...root, current.type]
                    : root
            , [] as InvoiceType[])
            .map(it => ({ value: it, label: translateInvoiceType(it) }))
    , [invoices]);

    const availableInvoiceStatuses = useMemo<NonNullable<ComponentProps<typeof Select>["data"]>>(() =>
        (invoices ?? [])
            .reduce((root, current) =>
                !root.includes(current.status)
                    ? [...root, current.status]
                    : root
            , [] as InvoiceStatus[])
            .map(s => ({ value: s, label: translateInvoiceStatus(s) }))
    , [invoices]);

    const lowestInvoiceAmount = useMemo(() =>
        (invoices ?? []).reduce((root, current) =>
            current.amount < root
                ? current.amount
                : root
            , 0)
    , [invoices]);

    const highestInvoiceAmount = useMemo(() =>
        (invoices ?? []).reduce((root, current) =>
            current.amount > root
                ? current.amount
                : root
            , 0)
    , [invoices]);

    useEffect(() => {
        getInvoices();
    }, []);

    const { allowAnimations } = useSettingsContext();
    
    return (
        <>
            <Modal size="xl" opened={!!pdfUrl} onClose={() => setPdfUrl(null)}>
                <object className="w-full h-[40rem]" data={pdfUrl ?? undefined} type="application/pdf">

                </object>
            </Modal>

            <main className="w-full h-full p-2 overflow-auto">
                <Transition mounted={!isInvoicesLoading} duration={allowAnimations ? undefined : 0} transition="fade-up" exitDuration={0}>
                    {style => (
                        <div className="w-full flex flex-col gap-2" style={style}>
                            <Paper withBorder shadow="sm" className="p-2 flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <Select
                                        label={t("common.Type")}
                                        value={type ?? "all"}
                                        data={[
                                            { value: "all", label: t("common.All") },
                                            ...availableInvoiceTypes
                                        ]}
                                        onChange={value => setType(!value || value === "all" ? null : (value as InvoiceType))}
                                    />

                                    <Select
                                        label={t("common.Status")}
                                        value={status ?? "all"}
                                        data={[
                                            { value: "all", label: t("common.All") },
                                            ...availableInvoiceStatuses
                                        ]}
                                        onChange={value => setStatus(!value || value === "all" ? null : (value as InvoiceStatus))}
                                    />
                                </div>

                                <RangeSlider
                                    className="my-6"
                                    value={[minAmount, maxAmount]}
                                    min={lowestInvoiceAmount}
                                    max={highestInvoiceAmount}
                                    marks={[
                                        { value: lowestInvoiceAmount, label: `${lowestInvoiceAmount}` },
                                        { value: 0, label: `0` },
                                        { value: highestInvoiceAmount, label: `${highestInvoiceAmount}` }
                                    ]}
                                    onChange={value => {
                                        setMinAmount(value[0]);
                                        setMaxAmount(value[1]);
                                    }}
                                />
                            </Paper>

                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Td>
                                            {t("common.Type")}
                                        </Table.Td>

                                        <Table.Td className="text-end">
                                            {t("common.Amount")}
                                        </Table.Td>

                                        <Table.Td>
                                            {t("common.DueDate")}
                                        </Table.Td>

                                        <Table.Td>
                                            {t("common.IssuedDate")}
                                        </Table.Td>

                                        <Table.Td>
                                            {t("common.PaidDate")}
                                        </Table.Td>

                                        <Table.Td>
                                            {t("common.Status")}
                                        </Table.Td>

                                        <Table.Td className="w-0">
                                            <span className="sr-only">
                                                {t("common.Actions")}
                                            </span>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Thead>

                                <Table.Tbody>
                                    {invoices
                                        ?.filter(i => type === null || i.type === type)
                                        .filter(i => status === null || i.status === status)
                                        .filter(i => i.amount >= minAmount)
                                        .filter(i => i.amount <= maxAmount)
                                        .map(invoice => (
                                        <Table.Tr key={invoice.id}>
                                            <Table.Td>
                                                {translateInvoiceType(invoice.type)}
                                            </Table.Td>

                                            <Table.Td className="italic text-end">
                                                {`${prettifyMoneyAmount(invoice.amount)} ${invoice.currency}`}
                                            </Table.Td>

                                            <Table.Td c={invoice.dueDate ? undefined : "gray"}>
                                                {invoice.dueDate ? (
                                                    <time dateTime={invoice.dueDate.toDateString()}>
                                                        {prettifyDate(invoice.dueDate)}
                                                    </time>
                                                ) : t("common.Never")}
                                            </Table.Td>

                                            <Table.Td>
                                                <time dateTime={invoice.issuedDate.toDateString()}>
                                                    {prettifyDate(invoice.issuedDate)}
                                                </time>
                                            </Table.Td>

                                            <Table.Td c={invoice.dueDate ? undefined : "gray"}>
                                                {invoice.paidDate ? (
                                                    <time dateTime={invoice.paidDate.toDateString()}>
                                                        {prettifyDate(invoice.paidDate)}
                                                    </time>
                                                ) : t("common.NotPaid")}
                                            </Table.Td>

                                            <Table.Td>
                                                <span className="sr-only">
                                                    {translateInvoiceStatus(invoice.status)}
                                                </span>

                                                <InvoiceStatusChip status={invoice.status} />
                                            </Table.Td>

                                            <Table.Td>
                                                <Menu>
                                                    <Menu.Target>
                                                        <ActionIcon variant="subtle">
                                                            <IconDots />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            leftSection={
                                                                invoice.status === InvoiceStatus.Unpaid
                                                                    ? <IconCoins />
                                                                    : <IconWorldWww />
                                                            }
                                                            rightSection={<IconExternalLink />}
                                                            onClick={openInBrowserOnClick(invoice.url)}>
                                                            {invoice.status === InvoiceStatus.Unpaid ? t("common.Pay") : t("common.ViewInBrowser")}
                                                        </Menu.Item>

                                                        <Menu.Item
                                                            leftSection={<IconPdf />}
                                                            rightSection={<IconExternalLink />}
                                                            onClick={openInBrowserOnClick(`${invoice.url}&format=pdf`)}>
                                                            {t("common.DownloadAsPdf")}
                                                        </Menu.Item>

                                                        <Menu.Item
                                                            leftSection={<IconPdf />}
                                                            onClick={() => setPdfUrl(`${invoice.url}&format=pdf`)}>
                                                            {t("common.OpenPdf")}
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                    )}
                </Transition>
            </main>
        </>
    );
};

export default Page;