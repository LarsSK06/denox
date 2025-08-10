"use client";

import Loader from "@/components/common/Loader";
import TagGetModel from "@/types/tags/TagGetModel";
import usePrimaryShade from "@/utils/hooks/usePrimaryShade";
import CreateEditTagModal from "@/components/tags/CreateEditTagModal";

import { ActionIcon, Button, Menu, Paper, Table, Transition, useMantineTheme } from "@mantine/core";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { IconDots, IconPencil, IconPlus } from "@tabler/icons-react";
import { useTagsContext } from "@/utils/contexts/useTagsContext";

const Page = () => {
    const [showCreateEditTagModal, setShowCreateEditModal] = useState<boolean>(false);
    const [tagToEdit, setTagToEdit] = useState<TagGetModel | null>(null);

    const { tags, getTags } = useTagsContext();

    useEffect(() => {
        getTags();
    }, []);

    const mantineTheme = useMantineTheme();
    const shadeIndexer = usePrimaryShade();

    return (
        <>
            <CreateEditTagModal
                show={showCreateEditTagModal || !!tagToEdit}
                onClose={() => {
                    setShowCreateEditModal(false);
                    setTagToEdit(null);
                }}
                tag={tagToEdit}
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
                                            <Table.Td>
                                                {t("common.Name")}
                                            </Table.Td>

                                            <Table.Td aria-hidden>
                                                {t("common.Color")}
                                            </Table.Td>

                                            <Table.Td>
                                                {t("domains.Domains")}
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
                                                            fill={mantineTheme.colors[tag.color][shadeIndexer]}
                                                        />
                                                    </svg>
                                                </Table.Td>

                                                <Table.Td>
                                                    {tag.domainsCount}
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

                                                            <Menu.Item leftSection={<IconPencil />} onClick={() => setTagToEdit(tag)} color="red">
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