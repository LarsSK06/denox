import ForwardGetModel from "@/types/forwards/ForwardGetModel";
import ForwardPostModel from "@/types/forwards/ForwardPostModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { ActionIcon, Checkbox, Table, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { t } from "i18next";
import { Dispatch, SetStateAction, useState } from "react";

type CreateForwardRowProps = {
    onClose: () => any;
    forwards: ForwardGetModel[];
    setForwards: Dispatch<SetStateAction<ForwardGetModel[] | null>>;
    domainId: number;
};

const CreateForwardRow = ({ onClose, forwards, setForwards, domainId }: CreateForwardRowProps) => {
    const [host, setHost] = useState<string>("");
    const [frame, setFrame] = useState<boolean>(false);
    const [url, setUrl] = useState<string>("");

    const [hostError, setHostError] = useState<string | null>(null);
    const [urlError, setUrlError] = useState<string | null>(null);

    const { call: createForward } = useHttpClient<{}, ForwardPostModel>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards],
        method: "POST",
        body: {
            host,
            frame,
            url
        }
    });

    const onKeyDown = (event: React.KeyboardEvent) => {
        if (event.key !== "Enter") return;

        setHostError(null);
        
        try {
            new URL(url);

            setUrlError(t("other.UrlNotValid"));
        }
        catch {
            return setUrlError(null);
        }

        createForward()
    };

    return (
        <Table.Tr>
            <Table.Td>
                <ActionIcon size="sm" color="red" onClick={() => onClose()}>
                    <IconX />
                </ActionIcon>
            </Table.Td>

            <Table.Td>
                <TextInput
                    autoFocus
                    value={host}
                    size="xs"
                    onChange={event => setHost(event.currentTarget.value)}
                    onKeyDown={onKeyDown}
                    error={hostError}
                />
            </Table.Td>

            <Table.Td>
                <Checkbox
                    checked={frame}
                    onChange={event => setFrame(event.currentTarget.checked)}
                />
            </Table.Td>

            <Table.Td>
                <TextInput
                    value={url}
                    size="xs"
                    onChange={event => setUrl(event.currentTarget.value)}
                    onKeyDown={onKeyDown}
                    error={urlError}
                />
            </Table.Td>
        </Table.Tr>
    );
};

export default CreateForwardRow;