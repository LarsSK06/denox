"use client";

import ColoredPill from "@/components/common/ColoredPill";
import Loader from "@/components/common/Loader";
import InvoiceStatusChip from "@/components/invoices/InvoiceStatusChip";
import Endpoint from "@/types/http/Endpoint";
import InvoiceGetModel from "@/types/invoices/InvoiceGetModel";
import InvoiceStatus from "@/types/invoices/InvoiceStatus";
import InvoiceType from "@/types/invoices/InvoiceType";
import InvoiceTagRelationGetModel from "@/types/tags/InvoiceTagRelationGetModel";
import TagGetModel from "@/types/tags/TagGetModel";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import prettifyDate from "@/utils/functions/prettifyDate";
import prettifyMoneyAmount from "@/utils/functions/prettifyMoneyAmount";
import translateInvoiceStatus from "@/utils/functions/translateInvoiceStatus";
import translateInvoiceType from "@/utils/functions/translateInvoiceType";
import useDbSelect from "@/utils/hooks/useDbSelect";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { ActionIcon, Menu, Paper, Select, Table, Transition } from "@mantine/core";
import { useDbContext } from "@/utils/contexts/useDbContext";
import { IconPlus } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";

const Page = () => {
    const [type, setType] = useState<InvoiceType | null>(null);
    const [status, setStatus] = useState<InvoiceStatus | null>(null);

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

    const {
        data: tags,
        call: getTags
    } = useDbSelect<TagGetModel[]>({ query: "SELECT * FROM tags" });

    const {
        data: invoiceTagRelations,
        setData: setInvoiceTagRelations,
        call: getInvoiceTagRelations
    } = useDbSelect<InvoiceTagRelationGetModel[]>({ query: "SELECT * FROM invoiceTagRelations" });

    useEffect(() => {
        getInvoices();
        getTags();
        getInvoiceTagRelations();
    }, []);

    const { database: db } = useDbContext();

    const removeTag = (invoiceId: number, tagId: number) => {
        const invoiceTagRelationSnapshot =
            structuredClone(invoiceTagRelations?.find(itr =>
                itr.invoiceId === invoiceId &&
                itr.tagId === tagId
            )!);

        setInvoiceTagRelations(prev => prev!.filter(itr => itr.id !== invoiceTagRelationSnapshot?.id));

        db.execute("DELETE FROM invoiceTagRelations WHERE invoiceId = $1 AND tagId = $2", [invoiceId, tagId])
            .catch(error => {
                setInvoiceTagRelations(prev => [...prev!, invoiceTagRelationSnapshot]);

                handleErrorMessage(t("tags.RemoveTagError"))(error);
            });
    };
    
    const addTag = (invoiceId: number, tagId: number) => {
        const syntheticId = Date.now();

        setInvoiceTagRelations(prev => [
            ...prev!,
            {
                id: syntheticId,
                invoiceId,
                tagId
            }
        ]);

        db.execute("INSERT INTO invoiceTagRelations (invoiceId, tagId) VALUES ($1, $2)", [invoiceId, tagId])
            .catch(error => {
                setInvoiceTagRelations(prev => prev!.filter(itr => itr.id !== syntheticId));

                handleErrorMessage(t("tags.AddTagError"))(error);
            });
    };

    const showTagsColumn = useMemo<boolean>(() => !!tags && tags.length > 0, [tags])

    return (
        <main className="w-full h-full relative overflow-hidden">
            <h1 className="sr-only">
                {t("invoices.Invoices")}
            </h1>

            <Transition mounted={!!invoices && !!tags && !!invoiceTagRelations} transition="fade-up">
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
                                        .filter(it => typeof it === "string")
                                        .map(it => ({ value: it, label: translateInvoiceType(it as InvoiceType) }))
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

                                        {showTagsColumn ? (
                                            <Table.Td>
                                                {t("tags.Tags")}
                                            </Table.Td>
                                        ) : null}
                                    </Table.Tr>
                                </Table.Thead>

                                <Table.Tbody>
                                    {invoices
                                        ?.filter(i => type === null || type === i.type)
                                        .filter(i => status === null || status === i.status)
                                        .map(invoice => {

                                        const tagsOnInvoice =
                                            tags?.filter(t =>
                                                invoiceTagRelations?.some(itr =>
                                                    itr.invoiceId === invoice.id &&
                                                    itr.tagId === t.id
                                                )
                                            );
                                        
                                        const tagsNotOnInvoice =
                                            tags?.filter(t =>
                                                !invoiceTagRelations?.some(itr =>
                                                    itr.invoiceId === invoice.id &&
                                                    itr.tagId === t.id
                                                )
                                            );
                                        
                                        return (
                                            <Table.Tr className="group" key={invoice.id}>
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

                                                {showTagsColumn ? (
                                                    <Table.Td>
                                                        <ul className="flex gap-2" aria-label={t("tags.Tags")}>
                                                            {tagsOnInvoice?.map(tag => (
                                                                <ColoredPill
                                                                    withRemoveButton
                                                                    component="li"
                                                                    color={tag.color}
                                                                    key={tag.id}
                                                                    onRemove={() => removeTag(invoice.id, tag.id)}>
                                                                    {tag.name}
                                                                </ColoredPill>
                                                            ))}

                                                            {tagsNotOnInvoice && tagsNotOnInvoice.length > 0 ? (
                                                                <li className="flex">
                                                                    <Menu>
                                                                        <Menu.Target>
                                                                            <ActionIcon size="sm" variant="subtle">
                                                                                <IconPlus />
                                                                            </ActionIcon>
                                                                        </Menu.Target>

                                                                        <Menu.Dropdown>
                                                                            {tagsNotOnInvoice?.map(tag => (
                                                                                <Menu.Item
                                                                                    key={tag.id}
                                                                                    onClick={() => addTag(invoice.id, tag.id)}>
                                                                                    {tag.name}
                                                                                </Menu.Item>
                                                                            ))}
                                                                        </Menu.Dropdown>
                                                                    </Menu>
                                                                </li>
                                                            ) : null}
                                                        </ul>
                                                    </Table.Td>
                                                ) : null}
                                            </Table.Tr>
                                        );
                                    })}
                                </Table.Tbody>
                            </Table>
                        </Paper>
                    </div>
                )}
            </Transition>

            <Transition mounted={!invoices || !tags || !invoiceTagRelations} transition="fade-up">
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