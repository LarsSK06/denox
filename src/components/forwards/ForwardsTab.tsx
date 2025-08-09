"use client";

import { ActionIcon, Anchor, Checkbox, Menu, Paper, Select, Table, TextInput, Transition } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { IconDots, IconRefresh } from "@tabler/icons-react";
import { t } from "i18next";

import useSearchParam from "@/utils/hooks/useSearchParam";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import Loader from "../common/Loader";
import ForwardGetModel from "@/types/forwards/ForwardGetModel";
import Check from "../common/Check";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";

const ForwardsTab = () => {
    const [search, setSearch] = useState<string>("");
    const [frame, setFrame] = useState<"true" | "false" | null>(null);

    const [selectedHosts, setSelectedHosts] = useState<string[]>([]);

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    const {
        data: forwards,
        call: getForwards
    } = useHttpClient<ForwardGetModel[]>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards]
    });
    
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

    return (
        <div className="w-full h-full relative">
            <Transition mounted={!!forwards} exitDuration={0} transition="fade-right">
                {style => (
                    <div className="w-full h-full p-2 flex items-start flex-col gap-2 overflow-auto" style={style}>
                        <Paper withBorder shadow="sm" className="p-2 flex items-end gap-2">
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

                        <Paper withBorder shadow="sm" className="!min-w-full">
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

                                        <Table.Td className="w-0">
                                            {t("common.Host")}
                                        </Table.Td>

                                        <Table.Td className="w-0">
                                            {t("common.Frame")}
                                        </Table.Td>

                                        <Table.Td className="w-0">
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
                                                <Check mode={forward.frame ? "true" : "false"} />
                                            </Table.Td>

                                            <Table.Td>
                                                <Anchor component="a" href={forward.url} onClick={openInBrowserOnClick()}>
                                                    {forward.url}
                                                </Anchor>
                                            </Table.Td>

                                            <Table.Td>
                                                <Menu>
                                                    <Menu.Target>
                                                        <ActionIcon variant="subtle">
                                                            <IconDots />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item>

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
    );
};

export default ForwardsTab;