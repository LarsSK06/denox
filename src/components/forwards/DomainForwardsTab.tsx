import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { ActionIcon, Anchor, Button, Checkbox, Table, TextInput, Transition } from "@mantine/core";
import { usePositionContext } from "@/utils/contexts/usePositionContext";
import { useEffect, useState } from "react";
import { t } from "i18next";
import { IconPlus } from "@tabler/icons-react";

import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import ForwardGetModel from "@/types/forwards/ForwardGetModel";
import Check from "../common/Check";
import openInBrowserOnClick from "@/utils/functions/openInBrowserOnClick";
import useGroupSelection from "@/utils/hooks/useGroupSelection";
import CreateForwardRow from "./CreateForwardRow";

const DomainForwardsTab = () => {
    const [showCreateForwardRow, setShowCreateForwardRow] = useState<boolean>(true);

    const { allowAnimations } = useSettingsContext();
    const { domainId } = usePositionContext();

    const {
        data: forwards,
        setData: setForwards,
        call: getForwards
    } = useHttpClient<ForwardGetModel[]>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards]
    });

    useEffect(() => {
        if (!domainId) setForwards(null);
        else getForwards();

        return () => setForwards(null);
    }, [domainId]);

    const {
        selectedIds: selectedForwardHosts,
        isSelected: isForwardSelected,
        isHeadChecked,
        isHeadIndeterminate,
        toggle: toggleForwardSelection,
        toggleHead
    } = useGroupSelection(forwards?.map(f => f.host) ?? []);

    return (
        <Transition mounted={!!forwards} exitDuration={0} transition="fade-up" duration={allowAnimations ? undefined : 0}>
            {style => (
                <div style={style} className="p-2">
                    <div>
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

                                    <Table.Td>
                                        {t("common.Host")}
                                    </Table.Td>

                                    <Table.Td>
                                        {t("common.Frame")}
                                    </Table.Td>

                                    <Table.Td>
                                        {t("common.Url")}
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {forwards?.map(forward => (
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
                                            <Check mode={forward.frame ? "true" : "false"} />
                                        </Table.Td>

                                        <Table.Td>
                                            <Anchor href={forward.url} onClick={openInBrowserOnClick()}>
                                                {forward.url}
                                            </Anchor>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}

                                {showCreateForwardRow ? (
                                    <CreateForwardRow
                                        onClose={() => setShowCreateForwardRow(false)}
                                        forwards={forwards ?? []}
                                        setForwards={setForwards}
                                        domainId={domainId ?? -1}
                                    />
                                ) : (
                                    <Table.Tr>
                                        <Table.Td>
                                            <ActionIcon size="sm" onClick={() => setShowCreateForwardRow(true)}>
                                                <IconPlus />
                                            </ActionIcon>
                                        </Table.Td>
                                    </Table.Tr>
                                )}
                            </Table.Tbody>
                        </Table>
                    </div>
                </div>
            )}
        </Transition>
    );
};

export default DomainForwardsTab;