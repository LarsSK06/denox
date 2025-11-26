"use client";

import { ActionIcon, Anchor, Button, Checkbox, Menu, Paper, Select, Table, TextInput, Transition } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { IconDots, IconPencil, IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react";
import { t } from "i18next";

import useSearchParam from "@/utils/hooks/useSearchParam";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import Loader from "../common/Loader";
import Forward_GET from "@/types/forwards/Forward_GET";
import Check from "../common/Check";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";
import CreateEditForwardModal from "./CreateEditForwardModal";

const ForwardsTab = () => {
    const [search, setSearch] = useState<string>("");
    const [frame, setFrame] = useState<"true" | "false" | null>(null);

    const [selectedHosts, setSelectedHosts] = useState<string[]>([]);

    const [showCreateEditForwardModal, setShowCreateEditForwardModal] = useState<boolean>(false);
    const [forwardToEdit, setForwardToEdit] = useState<Forward_GET | null>(null);

    const [disabledHosts, setDisabledHosts] = useState<string[]>([]);

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    const {
        data: forwards,
        setData: setForwards,
        call: getForwards
    } = useHttpClient<Forward_GET[]>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards]
    });

    const { call: deleteForward } = useHttpClient(forwardHost => ({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards, forwardHost],
        method: "DELETE"
    }));
    
    const filteredForwards = useMemo(() =>
        (forwards ?? [])
            .filter(f =>
                !search ||
                f.host.toLowerCase().includes(search.toLowerCase()) ||
                f.url.toLowerCase().includes(search.toLowerCase())
            )
            .filter(f => frame === null || `${f.frame}` === frame)
    , [forwards, search, frame]);

    useEffect(() => {
        if (!domainId) return;

        getForwards();
    }, [domainId]);

    useEffect(() => {
        setSelectedHosts(prev => prev.filter(host => filteredForwards?.some(f => f.host === host)));
    }, [filteredForwards]);

    useEffect(() => {
        if (!forwards) setDisabledHosts([]);
        else setDisabledHosts(prev => prev.filter(h => forwards.some(f => f.host === h)));
    }, [forwards]);

    const handleDeleteForward = (forwardHost: string) => {
        const snapshot = structuredClone(forwards?.find(f => f.host === forwardHost)!);

        setForwards(prev => prev!.filter(f => f.host !== forwardHost));

        deleteForward(forwardHost)
            .catch(() => {
                setForwards(prev => [
                    ...prev!,
                    snapshot
                ]);
            });
    };

    return (
        <>
            <CreateEditForwardModal
                show={showCreateEditForwardModal || !!forwardToEdit}
                onClose={() => {
                    setShowCreateEditForwardModal(false);
                    setForwardToEdit(null);
                }}
                domainId={domainId ?? -1}
                forward={forwardToEdit}
                setForwards={setForwards}
                setDisabledHosts={setDisabledHosts}
            />

            <div className="w-full h-full relative">
                <Transition mounted={!!forwards} exitDuration={0} transition="fade-right">
                    {style => (
                        <div className="w-full h-full p-2 flex items-start flex-col gap-2 overflow-auto" style={style}>
                            <Paper withBorder shadow="sm" className="p-2 flex items-end gap-2" style={{ minWidth: "100%" }}>
                                <TextInput
                                    label={t("common.Search")}
                                    value={search}
                                    onChange={event => setSearch(event.currentTarget.value)}
                                />

                                <Select
                                    label={t("common.Frame")}
                                    value={frame ?? ""}
                                    onChange={value => setFrame(value ? (value as typeof frame) : null)}
                                    data={[
                                        { value: "", label: t("common.All") },
                                        { value: "true", label: t("common.Yes") },
                                        { value: "false", label: t("common.No") }
                                    ]}
                                />

                                <ActionIcon size="input-sm" onClick={() => getForwards()}>
                                    <IconRefresh />
                                </ActionIcon>
                            </Paper>

                            <div className="flex gap-2">
                                <Button leftSection={<IconPlus />} onClick={() => setShowCreateEditForwardModal(true)}>
                                    {t("forwards.CreateForward")}
                                </Button>
                            </div>

                            <Paper withBorder shadow="sm" style={{ minWidth: "100%" }}>
                                <Table>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Td className="w-0">
                                                <Checkbox
                                                    indeterminate={
                                                        selectedHosts.length < filteredForwards.length &&
                                                        selectedHosts.length > 0
                                                    }
                                                    checked={selectedHosts.length >= filteredForwards.length}
                                                    onChange={() =>
                                                        setSelectedHosts(
                                                            selectedHosts.length === 0
                                                                ? filteredForwards.map(f => f.host)
                                                                : []
                                                        )
                                                    }
                                                />
                                            </Table.Td>

                                            <Table.Td className="w-0 font-bold">
                                                {t("common.Host")}
                                            </Table.Td>

                                            <Table.Td className="w-0 font-bold">
                                                {t("common.Frame")}
                                            </Table.Td>

                                            <Table.Td className="font-bold">
                                                {t("common.Url")}
                                            </Table.Td>

                                            <Table.Td className="w-0">
                                                <span className="sr-only">
                                                    {t("common.Actions")}
                                                </span>
                                            </Table.Td>
                                        </Table.Tr>
                                    </Table.Thead>

                                    <Table.Tbody>
                                        {filteredForwards
                                            .toSorted((a, b) => a.host > b.host ? 1 : -1)
                                            .map(forward => (
                                            <Table.Tr key={forward.host}>
                                                <Table.Td>
                                                    <Checkbox
                                                        checked={selectedHosts.includes(forward.host)}
                                                        onChange={() =>
                                                            setSelectedHosts(prev =>
                                                                prev.includes(forward.host)
                                                                    ? prev.filter(host => host !== forward.host)
                                                                    : [...prev, forward.host]
                                                            )
                                                        }
                                                    />
                                                </Table.Td>

                                                <Table.Td>
                                                    {forward.host}
                                                </Table.Td>

                                                <Table.Td>
                                                    <Check value={forward.frame} />
                                                </Table.Td>

                                                <Table.Td>
                                                    <Anchor component="a" href={forward.url} onClick={openInBrowserOnClick()}>
                                                        {forward.url}
                                                    </Anchor>
                                                </Table.Td>

                                                <Table.Td>
                                                    <Menu>
                                                        <Menu.Target>
                                                            <ActionIcon variant="subtle" disabled={disabledHosts.includes(forward.host)}>
                                                                <IconDots />
                                                            </ActionIcon>
                                                        </Menu.Target>

                                                        <Menu.Dropdown>
                                                            <Menu.Item leftSection={<IconPencil />} onClick={() => setForwardToEdit(forward)}>
                                                                {t("forwards.EditForward")}
                                                            </Menu.Item>

                                                            <Menu.Item leftSection={<IconTrash />} color="red" onClick={() => handleDeleteForward(forward.host)}>
                                                                {t("forwards.DeleteForward")}
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

                <Transition mounted={!forwards} transition="fade-right">
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

export default ForwardsTab;