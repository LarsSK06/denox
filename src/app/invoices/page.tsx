"use client";

import Loader from "@/components/common/Loader";
import InvoiceStatusChip from "@/components/invoices/InvoiceStatusChip";
import Endpoint from "@/types/http/Endpoint";
import InvoiceGetModel from "@/types/invoices/InvoiceGetModel";
import InvoiceStatus from "@/types/invoices/InvoiceStatus";
import InvoiceType from "@/types/invoices/InvoiceType";
import prettifyDate from "@/utils/functions/prettifyDate";
import prettifyMoneyAmount from "@/utils/functions/prettifyMoneyAmount";
import translateInvoiceStatus from "@/utils/functions/translateInvoiceStatus";
import translateInvoiceType from "@/utils/functions/translateInvoiceType";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { Paper, Select, Table, Transition } from "@mantine/core";
import { useMounted } from "@mantine/hooks";
import { t } from "i18next";
import { useEffect, useState } from "react";

const Page = () => {
    const [type, setType] = useState<InvoiceType | null>(null);
    const [status, setStatus] = useState<InvoiceStatus | null>(null);

    const isMounted = useMounted();

    const {
        data: invoices,
        call: getInvoices
    } = useHttpClient<InvoiceGetModel[]>({
        endpoint: Endpoint.Invoices,
        process: body => (body as any[]).map(i => ({
            ...i,
            dueDate: i.dueDate && new Date(i.dueDate),
            issuedDate: new Date(i.issuedDate),
            paidDate: i.paidDate && new Date(i.paidDate)
        }))
    });

    useEffect(() => {
        getInvoices();
    }, []);

    return (
        <main className="w-full h-full relative overflow-hidden">
            <h1 className="sr-only">
                {t("invoices.Invoices")}
            </h1>

            <Transition mounted={isMounted && !!invoices} transition="fade-up">
                {style => (
                    <div className="w-full h-full p-2 flex flex-col gap-2 overflow-auto" style={style}>
                        <Paper withBorder shadow="sm" className="p-2 flex gap-2">
                            <Select
                                label={t("common.Type")}
                                value={type ?? ""}
                                onChange={value => setType(value ? (value as typeof type) : null)}
                                data={[
                                    { value: "", label: t("common.All") },
                                    ...Object.values(InvoiceType)
                                        .filter(is => typeof is === "string")
                                        .map(is => ({ value: is, label: translateInvoiceType(is as InvoiceType) }))
                                ]}
                            />

                            <Select
                                label={t("common.Status")}
                                value={status ?? ""}
                                onChange={value => setStatus(value ? (value as typeof status) : null)}
                                data={[
                                    { value: "", label: t("common.All") },
                                    ...Object.values(InvoiceStatus)
                                        .filter(is => typeof is === "string")
                                        .map(is => ({ value: is, label: translateInvoiceStatus(is as InvoiceStatus) }))
                                ]}
                            />
                        </Paper>

                        <Paper withBorder shadow="sm">
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Td>
                                            {t("common.Type")}
                                        </Table.Td>

                                        <Table.Td align="right">
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
                                    </Table.Tr>
                                </Table.Thead>

                                <Table.Tbody>
                                    {invoices
                                        ?.filter(i => type === null || type === i.type)
                                        .filter(i => status === null || status === i.status)
                                        .map(invoice => (
                                        <Table.Tr key={invoice.id}>
                                            <Table.Td>
                                                {translateInvoiceType(invoice.type)}
                                            </Table.Td>

                                            <Table.Td align="right" c={invoice.amount < 0 ? "green" : undefined}>
                                                {`${prettifyMoneyAmount(invoice.amount)} ${invoice.currency}`}
                                            </Table.Td>

                                            <Table.Td c={invoice.dueDate ? undefined : "gray"}>
                                                {invoice.dueDate ? (
                                                    <time dateTime={invoice.dueDate.toDateString()}>
                                                        {prettifyDate(invoice.dueDate)}
                                                    </time>
                                                ) : t("common.None")}
                                            </Table.Td>

                                            <Table.Td>
                                                <time dateTime={invoice.issuedDate.toDateString()}>
                                                    {prettifyDate(invoice.issuedDate)}
                                                </time>
                                            </Table.Td>

                                            <Table.Td c={invoice.paidDate ? undefined : "gray"}>
                                                {invoice.paidDate ? (
                                                    <time dateTime={invoice.paidDate.toDateString()}>
                                                        {prettifyDate(invoice.paidDate)}
                                                    </time>
                                                ) : t("common.None")}
                                            </Table.Td>

                                            <Table.Td>
                                                <InvoiceStatusChip status={invoice.status} />
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </Paper>
                    </div>
                )}
            </Transition>

            <Transition mounted={!invoices} transition="fade-up">
                {style => (
                    <div className="w-full h-full top-0 left-0 flex justify-center items-center absolute" style={style}>
                        <Loader />
                    </div>
                )}
            </Transition>
        </main>
    );
};

export default Page;