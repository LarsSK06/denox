"use client";

import Loader from "@/components/common/Loader";
import Tag_GET from "@/types/tags/Tag_GET";
import CreateEditTagModal from "@/components/tags/CreateEditTagModal";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import useDbSelect from "@/utils/hooks/useDbSelect";

import { ActionIcon, Button, getThemeColor, Menu, Paper, Table, Transition, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDbContext } from "@/utils/contexts/useDbContext";

const Page = () => {
    const [showCreateEditTagModal, setShowCreateEditModal] = useState<boolean>(false);
    const [tagToEdit, setTagToEdit] = useState<Tag_GET | null>(null);

    const {
        data: tags,
        call: getTags,
        setData: setTags
    } = useDbSelect<(Tag_GET & { domainsCount: number; invoicesCount: number; })[]>({
        query: `
            SELECT
                *,
                (
                    SELECT COUNT(id)
                    FROM domainTagRelations dtr
                    WHERE dtr.tagId = t.id
                ) as domainsCount,
                (
                    SELECT COUNT(id)
                    FROM invoiceTagRelations itr
                    WHERE itr.tagId = t.id
                ) as invoicesCount
            FROM tags t
        `
    });

    useEffect(() => {
        getTags();
    }, []);

    const mantineTheme = useMantineTheme();

    const { database: db } = useDbContext();

    const deleteTag = (tagId: number) => {
        const tagSnapshot = structuredClone(tags?.find(t => t.id === tagId)!);

        setTags(prev => prev!.filter(t => t.id !== tagId));

        db.execute("DELETE FROM tags WHERE id = $1", [tagId])
            .catch(error => {
                setTags(prev => [
                    ...prev!,
                    tagSnapshot
                ]);

                handleErrorMessage(t("tags.DeleteTagError"))(error);
            });
    };

    return (
        <>
            <CreateEditTagModal
                show={showCreateEditTagModal || !!tagToEdit}
                onClose={() => {
                    setShowCreateEditModal(false);
                    setTagToEdit(null);
                }}
                tag={tagToEdit}
                setTags={setTags}
            />

            <main className="w-full h-full relative overflow-hidden">
                <h1 className="sr-only">
                    {t("tags.Tags")}
                </h1>

                <Transition mounted={!!tags} transition="fade-up">
                    {style => (
                        <div className="w-full h-full p-2 flex flex-col gap-2 overflow-auto" style={style}>
                            <div className="">
                                <Button leftSection={<IconPlus />} onClick={() => setShowCreateEditModal(true)}>
                                    {t("tags.CreateTag")}
                                </Button>
                            </div>

                            <Paper withBorder shadow="sm">
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Td className="font-bold">
                                                {t("common.Name")}
                                            </Table.Td>

                                            <Table.Td className="font-bold" aria-hidden>
                                                {t("common.Color")}
                                            </Table.Td>

                                            <Table.Td className="font-bold">
                                                {t("domains.Domains")}
                                            </Table.Td>

                                            <Table.Td className="font-bold">
                                                {t("invoices.Invoices")}
                                            </Table.Td>

                                            <Table.Td className="w-0">
                                                <span className="sr-only">
                                                    {t("common.Actions")}
                                                </span>
                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Thead>

                                    <Table.Tbody>
                                        {tags?.map(tag => (
                                            <Table.Tr key={tag.id}>
                                                <Table.Td>
                                                    {tag.name}
                                                </Table.Td>

                                                <Table.Td aria-hidden>
                                                    <svg style={{ width: "1rem" }} viewBox="0 0 10 10">
                                                        <circle
                                                            cx={5}
                                                            cy={5}
                                                            r="5"
                                                            fill={getThemeColor(tag.color, mantineTheme)}
                                                        />
                                                    </svg>
                                                </Table.Td>

                                                <Table.Td>
                                                    {tag.domainsCount}
                                                </Table.Td>

                                                <Table.Td>
                                                    {tag.invoicesCount}
                                                </Table.Td>

                                                <Table.Td>
                                                    <Menu>
                                                        <Menu.Target>
                                                            <ActionIcon variant="subtle">
                                                                <IconDots />
                                                            </ActionIcon>
                                                        </Menu.Target>

                                                        <Menu.Dropdown>
                                                            <Menu.Item leftSection={<IconPencil />} onClick={() => setTagToEdit(tag)}>
                                                                {t("tags.EditTag")}
                                                            </Menu.Item>

                                                            <Menu.Item leftSection={<IconTrash />} onClick={() => deleteTag(tag.id)} color="red">
                                                                {t("tags.DeleteTag")}
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

                <Transition mounted={!tags} transition="fade-up">
                    {style => (
                        <div className="w-full h-full top-0 left-0 flex justify-center items-center absolute" style={style}>
                            <Loader />
                        </div>
                    )}
                </Transition>
            </main>
        </>
    );
};

export default Page;