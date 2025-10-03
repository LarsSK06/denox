"use client";

import { ActionIcon, Button, CloseButton, Menu, Paper, Table, Text, Transition } from "@mantine/core";
import { useDbContext } from "@/utils/contexts/useDbContext";
import { dummyDomain } from "@/utils/globals";
import { useEffect, useMemo, useState } from "react";
import { IconAddressBook, IconBolt, IconPlus, IconRestore } from "@tabler/icons-react";
import { t } from "i18next";

import DomainPeriodProgressCircle from "./DomainPeriodProgressCircle";
import DomainStatusChip from "./DomainStatusChip";
import DomainWebHotelSizeChip from "./DomainWebHotelSizeChip";
import Check from "../common/Check";
import useSearchParam from "@/utils/hooks/useSearchParam";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Loader from "../common/Loader";
import useDbSelect from "@/utils/hooks/useDbSelect";
import TagGetModel from "@/types/tags/TagGetModel";
import ColoredPill from "../common/ColoredPill";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import NoteGetModel from "@/types/notes/NoteGetModel";
import CreateNoteModal from "../notes/CreateNoteModal";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";

const DomainOverviewTab = () => {
    const [showCreateNoteModal, setShowCreateNoteModal] = useState<boolean>(false);

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    const { database: db } = useDbContext();

    const {
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
        data: tags,
        setData: setTags,
        call: getTags
    } = useDbSelect<(TagGetModel & { isOnDomain: boolean; })[]>({
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

    const {
        data: notes,
        setData: setNotes,
        call: getNotes
    } = useDbSelect<NoteGetModel[]>({
        query: `
            SELECT * FROM notes WHERE domain = $1
        `,
        bindValues: [domain?.domain]
    });

    useEffect(() => {
        if (!domainId) return;

        getDomain();
    }, [domainId]);

    useEffect(() => {
        if (!domain) return;

        getTags();
        getNotes();
    }, [domain]);

    const isLoadingGenerally =
        !domain ||
        !tags ||
        !notes;

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

    const deleteNote = (noteId: number) => {
        const noteSnapshot = structuredClone(notes?.find(n => n.id === noteId)!);

        setNotes(prev => prev!.filter(n => n.id !== noteId));

        db.execute("DELETE FROM notes WHERE id = $1", [noteId])
            .catch(error => {
                setNotes(prev => [...prev!, noteSnapshot]);

                handleErrorMessage(t("notes.DeleteNoteError"))(error);
            });
    };

    return (
        <>
            <CreateNoteModal
                show={showCreateNoteModal}
                onClose={() => setShowCreateNoteModal(false)}
                domain={domain?.domain ?? ""}
                setNotes={setNotes}
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
                            
                            <ul className="w-full flex items-stretch gap-2" style={{ flexWrap: "wrap" }}>
                                {notes
                                    ?.toSorted((a, b) => a.id > b.id ? 1 : -1)
                                    .map(note => (
                                    <Paper withBorder shadow="sm" component="li" key={note.id}>
                                        <div className="w-fit ml-auto">
                                            <CloseButton onClick={() => deleteNote(note.id)} disabled={`${note.id}`.includes(".")} />
                                        </div>

                                        <Text component="pre" className="max-w-full p-2">
                                            {note.text}
                                        </Text>
                                    </Paper>
                                ))}

                                <li className="h-auto">
                                    <ActionIcon aria-haspopup="dialog" onClick={() => setShowCreateNoteModal(true)}>
                                        <IconPlus />
                                    </ActionIcon>
                                </li>
                            </ul>

                            <div className="w-full flex flex-wrap justify-center gap-2" aria-label={t("common.QuickActions")}>
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

                            <Paper withBorder shadow="sm" className="w-full">
                                <Text className="p-2" component="h3" size="lg">
                                    {t("common.Services")}
                                </Text>

                                <Table>
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
                            </Paper>

                            <Paper withBorder shadow="sm" className="w-full">
                                <Text className="p-2" component="h3" size="lg">
                                    {t("common.Nameservers")}
                                </Text>

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
                            </Paper>
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