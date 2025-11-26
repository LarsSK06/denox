"use client";

import { ActionIcon, Button, Checkbox, CloseButton, Divider, Menu, Paper, Table, Text, Transition } from "@mantine/core";
import { useDbContext } from "@/utils/contexts/useDbContext";
import { dummyDomain } from "@/utils/globals";
import { useEffect, useMemo, useState } from "react";
import { IconAddressBook, IconBolt, IconPlus, IconRestore, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";

import DomainPeriodProgressCircle from "./DomainPeriodProgressCircle";
import DomainStatusChip from "./DomainStatusChip";
import DomainWebHotelSizeChip from "./DomainWebHotelSizeChip";
import Check from "../common/Check";
import useSearchParam from "@/utils/hooks/useSearchParam";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import Domain_GET from "@/types/domains/Domain_GET";
import Loader from "../common/Loader";
import useDbSelect from "@/utils/hooks/useDbSelect";
import Tag_GET from "@/types/tags/Tag_GET";
import ColoredPill from "../common/ColoredPill";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import CreateNoteModal from "../notes/CreateNoteModal";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";
import useNotesRepository from "@/utils/repositories/notesRepository";
import domainProcessor from "@/utils/processors/domainProcessor";

const DomainOverviewTab = () => {
    const [showCreateNoteModal, setShowCreateNoteModal] = useState<boolean>(false);

    const [selectedNoteIds, setSelectedNoteIds] = useState<number[]>([]);

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    const { database: db } = useDbContext();

    const {
        data: domain,
        call: getDomain
    } = useHttpClient<Domain_GET>({
        endpoint: [Endpoint.Domains, domainId],
        process: domainProcessor
    });

    const {
        data: tags,
        setData: setTags,
        call: getTags
    } = useDbSelect<(Tag_GET & { isOnDomain: boolean; })[]>({
        query: `
            SELECT
                t.*,
                EXISTS (
                    SELECT 1
                    FROM domainTagRelations dtr
                    WHERE dtr.domain = $1 AND dtr.tagId = t.id
                ) as isOnDomain
            FROM tags t
        `,
        bindValues: [domain?.domain]
    });

    const notesRepository = useNotesRepository({ domain: domain?.domain ?? "" });

    useEffect(() => {
        if (!domainId) return;

        getDomain();
    }, [domainId]);

    useEffect(() => {
        if (!domain) return;

        getTags();
        notesRepository.getNotes();
    }, [domain]);

    useEffect(() => {
        setSelectedNoteIds(prev => prev.filter(id => notesRepository.notes?.some(n => n.id === id)));
    }, [notesRepository.notes]);

    const isLoadingGenerally =
        !domain ||
        !tags ||
        !notesRepository.notes;

    const tagsOnDomain = useMemo(() => tags?.filter(t => t.isOnDomain) ?? [], [tags]);
    const tagsNotOnDomain = useMemo(() => tags?.filter(t => !t.isOnDomain) ?? [], [tags]);

    const removeTag = (tagId: number) => {
        setTags(prev =>
            prev!.map(t =>
                t.id === tagId ? {
                    ...t,
                    isOnDomain: false
                } : t
            )
        );

        db.execute("DELETE FROM domainTagRelations WHERE domain = $1 AND tagId = $2", [domain?.domain, tagId])
            .catch(error => {
                setTags(prev =>
                    prev!.map(t =>
                        t.id === tagId ? {
                            ...t,
                            isOnDomain: true
                        } : t
                    )
                );

                handleErrorMessage(t("tags.RemoveTagError"))(error);
            });
    };

    const addTag = (tagId: number) => {
        setTags(prev =>
            prev!.map(t =>
                t.id === tagId ? {
                    ...t,
                    isOnDomain: true
                } : t
            )
        );

        db.execute("INSERT INTO domainTagRelations (domain, tagId) VALUES ($1, $2)", [domain?.domain, tagId])
            .catch(error => {
                setTags(prev =>
                    prev!.map(t =>
                        t.id === tagId ? {
                            ...t,
                            isOnDomain: false
                        } : t
                    )
                );

                handleErrorMessage(t("tags.AddTagError"))(error);
            });
    };

    const quickActionsLabelId = "quick-actions-label";

    return (
        <>
            <CreateNoteModal
                show={showCreateNoteModal}
                onClose={() => setShowCreateNoteModal(false)}
                notesRepository={notesRepository}
            />

            <div className="w-full h-full relative">
                <Transition mounted={!isLoadingGenerally} transition="fade-right">
                    {style => (
                        <div className="w-full h-full p-2 flex flex-col items-center gap-8 overflow-auto" style={style}>
                            <DomainPeriodProgressCircle domain={domain ?? dummyDomain} />

                            <Text component="h2" size="xl" aria-hidden>
                                {domain?.domain ?? dummyDomain.domain}
                            </Text>

                            <ul className="flex gap-2" aria-label={t("tags.Tags")}>
                                {tagsOnDomain.map(tag => (
                                    <ColoredPill
                                        withRemoveButton
                                        component="li"
                                        color={tag.color}
                                        key={tag.id}
                                        onRemove={() => removeTag(tag.id)}>
                                        {tag.name}
                                    </ColoredPill>
                                ))}

                                {tagsNotOnDomain.length > 0 ? (
                                    <li className="flex">
                                        <Menu>
                                            <Menu.Target>
                                                <ActionIcon size="sm" variant="subtle">
                                                    <IconPlus />
                                                </ActionIcon>
                                            </Menu.Target>

                                            <Menu.Dropdown>
                                                {tagsNotOnDomain.map(tag => (
                                                    <Menu.Item
                                                        key={tag.id}
                                                        onClick={() => addTag(tag.id)}>
                                                        {tag.name}
                                                    </Menu.Item>
                                                ))}
                                            </Menu.Dropdown>
                                        </Menu>
                                    </li>
                                ) : null}
                            </ul>

                            <Divider
                                className="w-full mt-20"
                                label={
                                    <span id={quickActionsLabelId}>
                                        {t("common.QuickActions")}
                                    </span>
                                }
                            />

                            <div className="w-full flex flex-wrap justify-center gap-2" aria-labelledby={quickActionsLabelId}>
                                <Button
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&command=renew`}
                                    onClick={openInBrowserOnClick()}
                                    leftSection={<IconRestore />}
                                    variant="light">
                                    {t("common.Renew")}
                                </Button>

                                <Button
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&view=upgrade`}
                                    onClick={openInBrowserOnClick()}
                                    leftSection={<IconBolt />}
                                    variant="light">
                                    {t("common.Upgrade")}
                                </Button>

                                <Button
                                    component="a"
                                    href={`https://domene.shop/admin?id=${domainId}&edit=contacts`}
                                    onClick={openInBrowserOnClick()}
                                    leftSection={<IconAddressBook />}
                                    variant="light">
                                    {t("common.ChangeContactInfo")}
                                </Button>
                            </div>

                            <Divider className="w-full mt-20" label={t("common.Services")} />

                            <Table aria-label={t("common.Services")}>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Registrant")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            {domain?.registrant}
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Status")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <DomainStatusChip status={domain?.status ?? dummyDomain.status} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.WebHotel")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <DomainWebHotelSizeChip size={domain?.services.webhotel ?? dummyDomain.services.webhotel} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Renew")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <Check mode={domain?.renew ? "true" : "false"} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Registrar")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <Check mode={domain?.services.registrar ? "true" : "false"} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.DNS")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <Check mode={domain?.services.dns ? "true" : "false"} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Email")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <Check mode={domain?.services.email ? "true" : "false"} />
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>

                            <Divider className="w-full mt-20" label={t("common.Nameservers")} />

                            <Table aria-hidden>
                                <Table.Tbody>
                                    {(domain?.nameservers ?? dummyDomain.nameservers).map((ns, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Th>
                                                {i + 1}
                                            </Table.Th>

                                            <Table.Td align="right">
                                                {ns}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>

                            <ol className="sr-only">
                                {(domain?.nameservers ?? dummyDomain.nameservers).map((ns, i) => (
                                    <li key={i}>
                                        {ns}
                                    </li>
                                ))}
                            </ol>

                            <Divider className="w-full mt-20" label={t("notes.Notes")} />

                            <div className="w-full">
                                <div className="flex gap-2">
                                    <Button aria-haspopup="dialog" leftSection={<IconPlus />} onClick={() => setShowCreateNoteModal(true)}>
                                        {t("notes.CreateNote")}
                                    </Button>

                                    <Transition mounted={selectedNoteIds.length > 0} transition="fade">
                                        {buttonStyle => (
                                            <Button
                                                loading={notesRepository.isDeleteNotesLoading}
                                                leftSection={<IconTrash />}
                                                onClick={() => notesRepository.deleteNotes(selectedNoteIds)}
                                                color="red"
                                                style={buttonStyle}>
                                                {t("notes.DeleteNotes")}
                                            </Button>
                                        )}
                                    </Transition>
                                </div>

                                <ul className="w-full mt-2 flex items-stretch gap-2">
                                    {notesRepository.notes
                                        ?.toSorted((a, b) => a.id > b.id ? 1 : -1)
                                        .map(note => (
                                        <Paper withBorder shadow="sm" component="li" key={note.id}>
                                            <Paper withBorder className="flex justify-between items-center border-t-0 border-r-0 border-l-0">
                                                <Checkbox
                                                    checked={selectedNoteIds.includes(note.id)}
                                                    onChange={() => {
                                                        setSelectedNoteIds(prev =>
                                                            prev.includes(note.id)
                                                                ? prev.filter(id => id !== note.id)
                                                                : [...prev, note.id]
                                                        )
                                                    }}
                                                    className="mx-1"
                                                />

                                                <CloseButton onClick={() => notesRepository.deleteNotes([note.id])} disabled={`${note.id}`.includes(".")} />
                                            </Paper>

                                            <Text component="pre" className="max-w-full p-2">
                                                {note.text}
                                            </Text>
                                        </Paper>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </Transition>

                <Transition mounted={isLoadingGenerally} transition="fade-right">
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

export default DomainOverviewTab;