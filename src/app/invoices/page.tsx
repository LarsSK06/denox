"use client";

import ColoredPill from "@/components/common/ColoredPill";
import Loader from "@/components/common/Loader";
import InvoiceStatusChip from "@/components/invoices/InvoiceStatusChip";
import Endpoint from "@/types/http/Endpoint";
import Invoice_GET from "@/types/invoices/Invoice_GET";
import InvoiceStatus from "@/types/invoices/InvoiceStatus";
import InvoiceType from "@/types/invoices/InvoiceType";
import InvoiceTagRelation_GET from "@/types/tags/InvoiceTagRelation_GET";
import Tag_GET from "@/types/tags/Tag_GET";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import prettifyDate from "@/utils/functions/prettifyDate";
import prettifyNumber from "@/utils/functions/prettifyNumber";
import translateInvoiceStatus from "@/utils/functions/translateInvoiceStatus";
import translateInvoiceType from "@/utils/functions/translateInvoiceType";
import useDbSelect from "@/utils/hooks/useDbSelect";
import useHttpClient from "@/utils/hooks/useHttpClient";
import invoiceProcessor from "@/utils/processors/invoiceProcessor";
import downloadOnClick from "@/utils/functions/downloadOnClick";
import useColorPair from "@/utils/hooks/useColorPair";

import { ActionIcon, Anchor, Menu, Paper, Select, Table, Text, Transition, useMantineTheme } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useDbContext } from "@/utils/contexts/useDbContext";
import { IconDots, IconExclamationCircle, IconInfoCircle, IconPdf, IconPlus } from "@tabler/icons-react";
import { t } from "i18next";

const Page = () => {
    const [type, setType] = useState<InvoiceType | null>(null);
    const [status, setStatus] = useState<InvoiceStatus | null>(null);

    const {
        data: invoices,
        call: getInvoices
    } = useHttpClient<Invoice_GET[]>({
        endpoint: Endpoint.Invoices,
        process: invoiceProcessor
    });

    const {
        data: tags,
        call: getTags
    } = useDbSelect<Tag_GET[]>({ query: "SELECT * FROM tags" });

    const {
        data: invoiceTagRelations,
        setData: setInvoiceTagRelations,
        call: getInvoiceTagRelations
    } = useDbSelect<InvoiceTagRelation_GET[]>({ query: "SELECT * FROM invoiceTagRelations" });

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

    const showTagsColumn = useMemo<boolean>(() => !!tags && tags.length > 0, [tags]);

    const [greenBgColor, greenFgColor] = useColorPair("green");
    const [redBgColor, redFgColor] = useColorPair("red");

    const mantineTheme = useMantineTheme();

    const unclaimedCreditNotasTotal =
        invoices?.reduce((root, current) =>
            current.amount < 0 &&
            current.type === InvoiceType.CreditNote &&
            current.status === InvoiceStatus.Unpaid
                ? root + Math.abs(current.amount)
                : root
        , 0);

    const unclaimedCreditNotasCurrencies =
        invoices?.reduce((root, current) =>
            !root.includes(current.currency) &&
            current.amount < 0 &&
            current.type === InvoiceType.CreditNote &&
            current.status === InvoiceStatus.Unpaid
                ? [...root, current.currency]
                : root
        , [] as string[]).join("/");

    const unpaidInvoicesTotal =
        invoices?.reduce((root, current) =>
            current.amount > 0 &&
            current.type === InvoiceType.Invoice &&
            current.status === InvoiceStatus.Unpaid
                ? root + Math.abs(current.amount)
                : root
        , 0);

    const unpaidInvoicesCurrencies =
        invoices?.reduce((root, current) =>
            !root.includes(current.currency) &&
            current.amount > 0 &&
            current.type === InvoiceType.Invoice &&
            current.status === InvoiceStatus.Unpaid
                ? [...root, current.currency]
                : root
        , [] as string[]).join("/");

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

                        {unclaimedCreditNotasTotal ? (
                            <Paper
                                withBorder
                                shadow="sm"
                                className="p-2 flex gap-2"
                                style={{
                                    borderColor: greenFgColor,
                                    backgroundColor: greenBgColor
                                }}>
                                <div className="h-full flex items-center">
                                    <IconInfoCircle color={greenFgColor} />
                                </div>

                                <Text className="w-0 grow" c={greenFgColor}>
                                    {t("other.UnclaimedCreditNotasAlert", {
                                        amount: prettifyNumber(unclaimedCreditNotasTotal),
                                        currency: unclaimedCreditNotasCurrencies
                                    })}
                                </Text>

                                <div className="h-full flex items-center">
                                    <Anchor
                                        underline="always"
                                        c={greenFgColor}
                                        component="button"
                                        onClick={() => {
                                            setType(InvoiceType.CreditNote);
                                            setStatus(InvoiceStatus.Unpaid);
                                        }}>
                                        {t("other.SeeUnclaimed")}
                                    </Anchor>
                                </div>
                            </Paper>
                        ) : null}

                        {unpaidInvoicesTotal ? (
                            <Paper
                                withBorder
                                shadow="sm"
                                className="p-2 flex gap-2"
                                style={{
                                    borderColor: redFgColor,
                                    backgroundColor: redBgColor
                                }}>
                                <div className="h-full flex items-center">
                                    <IconExclamationCircle color={redFgColor} />
                                </div>

                                <Text c={redFgColor} className="w-0 grow">
                                    {t("other.UnpaidInvoicesAlert", {
                                        amount: prettifyNumber(unpaidInvoicesTotal),
                                        currency: unpaidInvoicesCurrencies
                                    })}
                                </Text>

                                <div className="h-full flex items-center">
                                    <Anchor
                                        underline="always"
                                        c={redFgColor}
                                        component="button"
                                        onClick={() => {
                                            setType(InvoiceType.Invoice);
                                            setStatus(InvoiceStatus.Unpaid);
                                        }}>
                                        {t("other.SeeUnclaimed")}
                                    </Anchor>
                                </div>
                            </Paper>
                        ) : null}

                        <Paper withBorder shadow="sm">
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Td className="font-bold">
                                            {t("common.Type")}
                                        </Table.Td>

                                        <Table.Td className="font-bold" align="right">
                                            {t("common.Amount")}
                                        </Table.Td>

                                        <Table.Td className="font-bold">
                                            {t("common.DueDate")}
                                        </Table.Td>

                                        <Table.Td className="font-bold">
                                            {t("common.IssuedDate")}
                                        </Table.Td>

                                        <Table.Td className="font-bold">
                                            {t("common.PaidDate")}
                                        </Table.Td>

                                        <Table.Td className="font-bold">
                                            {t("common.Status")}
                                        </Table.Td>

                                        {showTagsColumn ? (
                                            <Table.Td className="font-bold">
                                                {t("tags.Tags")}
                                            </Table.Td>
                                        ) : null}

                                        <Table.Td className="w-0">
                                            <span className="sr-only">
                                                {t("common.Actions")}
                                            </span>
                                        </Table.Td>
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
                                                    {`${prettifyNumber(invoice.amount)} ${invoice.currency}`}
                                                </Table.Td>

                                                <Table.Td c={invoice.dueDate ? undefined : "gray"}>
                                                    {invoice.dueDate ? (
                                                        <time dateTime={invoice.dueDate.toISOString().split("T")[0]}>
                                                            {prettifyDate(invoice.dueDate)}
                                                        </time>
                                                    ) : null}
                                                </Table.Td>

                                                <Table.Td>
                                                    <time dateTime={invoice.issuedDate.toISOString().split("T")[0]}>
                                                        {prettifyDate(invoice.issuedDate)}
                                                    </time>
                                                </Table.Td>

                                                <Table.Td>
                                                    {invoice.paidDate ? (
                                                        <time dateTime={invoice.paidDate.toISOString().split("T")[0]}>
                                                            {prettifyDate(invoice.paidDate)}
                                                        </time>
                                                    ) : null}
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

                                                <Table.Td>
                                                    <Menu>
                                                        <Menu.Target>
                                                            <ActionIcon variant="subtle">
                                                                <IconDots />
                                                            </ActionIcon>
                                                        </Menu.Target>

                                                        <Menu.Dropdown>
                                                            <Menu.Item
                                                                leftSection={<IconPdf />}
                                                                onClick={downloadOnClick(`${invoice.url}&format=pdf`)}>
                                                                {t("common.DownloadAsPdf")}
                                                            </Menu.Item>
                                                        </Menu.Dropdown>
                                                    </Menu>
                                                </Table.Td>
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