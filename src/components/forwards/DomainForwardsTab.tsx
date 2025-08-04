import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { ActionIcon, Anchor, Button, Checkbox, Menu, Paper, Select, Table, TextInput, Tooltip, Transition } from "@mantine/core";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { useDomainForwardsContext } from "@/utils/contexts/useDomainForwardsContext";
import { IconAlertCircle, IconDots, IconPencil, IconPlus, IconRefresh, IconTrash } from "@tabler/icons-react";
import { usePositionContext } from "@/utils/contexts/usePositionContext";

import Check from "../common/Check";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";
import useGroupSelection from "@/utils/hooks/useGroupSelection";
import CreateEditForwardModal from "./CreateEditForwardModal";
import ForwardGetModel from "@/types/forwards/ForwardGetModel";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";

const DomainForwardsTab = () => {
    const [showCreateEditForwardModal, setShowCreateEditForwardModal] = useState<boolean>(false);
    const [forwardToEdit, setForwardToEdit] = useState<ForwardGetModel | null>(null);

    const [searchString, setSearchString] = useState<string>("");
    const [frame, setFrame] = useState<"true" | "false" | null>(null);

    const [isDeleteHostsLoading, setIsDeleteHostsLoading] = useState<boolean>(false);

    const { allowAnimations } = useSettingsContext();
    const { domainId } = usePositionContext();

    const {
        forwards,
        setForwards,
        getForwards
    } = useDomainForwardsContext();

    const { call: deleteForward } = useHttpClient(forwardHost => ({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards, forwardHost],
        method: "DELETE"
    }));

    useEffect(() => {
        getForwards();

        return () => setForwards(null);
    }, []);

    const {
        selectedIds: selectedForwardHosts,
        isSelected: isForwardSelected,
        isHeadChecked,
        isHeadIndeterminate,
        toggle: toggleForwardSelection,
        toggleHead
    } = useGroupSelection(forwards?.map(f => f.host) ?? []);

    const handleDeleteSelectedForwards = () => {
        setIsDeleteHostsLoading(true);

        setForwards(prev => prev!.filter(f => !selectedForwardHosts.includes(f.host)));

        Promise.all(selectedForwardHosts.map(h => deleteForward(h).catch(handleErrorMessage(t("forwards.DeleteForwardError")))))
            .catch(() => getForwards())
            .finally(() => setIsDeleteHostsLoading(false));
    };

    const handleDeleteForward = (forwardHost: string) => {
        const forwardSnapshot = structuredClone(forwards!.find(f => f.host === forwardHost)!);

        setForwards(prev => prev!.filter(f => f.host !== forwardHost));

        deleteForward(forwardHost)
            .catch(error => {
                setForwards(prev => [
                    ...prev!,
                    forwardSnapshot
                ]);

                handleErrorMessage(t("forwards.DeleteForwardError"))(error);
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
                forward={forwardToEdit}
            />

            <Transition mounted={!!forwards} exitDuration={0} transition="fade-up" duration={allowAnimations ? undefined : 0}>
                {style => (
                    <div style={style} className="p-2 flex flex-col gap-2">
                        <Paper withBorder shadow="sm" className="p-2 flex items-end gap-2">
                            <TextInput
                                label={t("common.Search")}
                                value={searchString}
                                onChange={event => setSearchString(event.currentTarget.value)}
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

                            <Tooltip label={t("common.Refresh")}>
                                <ActionIcon size="input-sm" onClick={() => getForwards()}>
                                    <IconRefresh />
                                </ActionIcon>
                            </Tooltip>
                        </Paper>

                        <div className="flex gap-2">
                            <Button leftSection={<IconPlus />} onClick={() => setShowCreateEditForwardModal(true)}>
                                {t("forwards.CreateForward")}
                            </Button>

                            <Button
                                leftSection={<IconTrash />}
                                color="red"
                                disabled={selectedForwardHosts.length === 0}
                                loading={isDeleteHostsLoading}
                                className="transition-colors"
                                onClick={() => handleDeleteSelectedForwards()}>
                                {t("forwards.DeleteForwards", { count: selectedForwardHosts.length })}
                            </Button>
                        </div>

                        <Paper withBorder shadow="sm">
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Td className="w-0">
                                            <Checkbox
                                                checked={isHeadChecked}
                                                indeterminate={isHeadIndeterminate}
                                                onChange={() => toggleHead()}
                                            />
                                        </Table.Td>

                                        <Table.Td className="font-bold">
                                            {t("common.Host")}
                                        </Table.Td>

                                        <Table.Td className="font-bold">
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
                                    {forwards
                                        ?.filter(f =>
                                            f.host.toLowerCase().includes(searchString.toLowerCase()) ||
                                            f.url.toLowerCase().includes(searchString.toLowerCase())
                                        )
                                        .filter(f =>
                                            !frame ||
                                            (frame === "true" && f.frame) ||
                                            (frame === "false" && !f.frame)
                                        )
                                        .toSorted((a, b) => a.host > b.host ? 1 : -1)
                                        .map(forward => (
                                        <Table.Tr key={forward.host}>
                                            <Table.Td>
                                                <Checkbox
                                                    checked={isForwardSelected(forward.host)}
                                                    onChange={() => toggleForwardSelection(forward.host)}
                                                />
                                            </Table.Td>

                                            <Table.Td>
                                                {forward.host}
                                            </Table.Td>

                                            <Table.Td>
                                                <div className="flex gap-2">
                                                    <Check mode={forward.frame ? "true" : "false"} />

                                                    {forward.frame ? (
                                                        <>
                                                            <Tooltip label={t("common.NotRecommended")}>
                                                                <IconAlertCircle color="orange" aria-hidden />
                                                            </Tooltip>
                                                        
                                                            <span className="sr-only">
                                                                {t("common.NotRecommended")}
                                                            </span>
                                                        </>
                                                    ) : null}
                                                </div>
                                            </Table.Td>

                                            <Table.Td>
                                                <Anchor href={forward.url} onClick={openInBrowserOnClick()}>
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
        </>
    );
};

export default DomainForwardsTab;