import ForwardGetModel from "@/types/forwards/ForwardGetModel";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import ForwardPostModel from "@/types/forwards/ForwardPostModel";
import ForwardPutModel from "@/types/forwards/ForwardPutModel";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";

import { Button, Checkbox, Modal, TextInput } from "@mantine/core";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { t } from "i18next";

type CreateEditForwardModalProps = {
    show: boolean;
    onClose: () => unknown;
    domainId: number;
    forward: ForwardGetModel | null;
    setForwards: Dispatch<SetStateAction<ForwardGetModel[] | null>>;
};

const CreateEditForwardModal = ({ show, onClose, domainId, forward, setForwards }: CreateEditForwardModalProps) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(!!forward);

    const [host, setHost] = useState<string>(forward?.host ?? "");
    const [frame, setFrame] = useState<boolean>(forward?.frame ?? false);
    const [url, setUrl] = useState<string>(forward?.url ?? "");

    const [urlError, setUrlError] = useState<string | null>(null);

    const setValues = () => {
        setIsEditMode(!!forward);

        setHost(forward?.host ?? "");
        setFrame(forward?.frame ?? false);
        setUrl(forward?.url ?? "");
    };

    useEffect(() => {
        if (show) setValues();
        else setTimeout(setValues, 300);
    }, [show]);

    useEffect(() => {
        if (forward) setValues();
        else setTimeout(setValues, 300);
    }, [forward]);

    const { call: createForward } = useHttpClient<{}, ForwardPostModel>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards],
        method: "POST",
        body: {
            host,
            frame,
            url
        }
    });

    const { call: editForward } = useHttpClient<{}, ForwardPutModel>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards, forward?.host],
        method: "PUT",
        body: {
            host,
            frame,
            url
        }
    });

    const onFormSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();

        try { const _ = new URL(url); }
        catch {
            setUrlError(t("other.UrlNotValid"));

            return;
        }

        if (forward) {
            setForwards(prev => [
                ...prev!.filter(f => f.host !== forward.host),
                {
                    host,
                    frame,
                    url
                }
            ]);

            editForward()
                .catch(error => {
                    setForwards(prev => [
                        ...prev!.filter(f => f.host !== forward.host),
                        forward
                    ]);

                    handleErrorMessage(t("forwards.EditForwardError"))(error);
                });
        }
        else {
            setForwards(prev => [
                ...prev!,
                {
                    host,
                    frame,
                    url
                }
            ]);

            createForward()
                .catch(error => {
                    setForwards(prev => prev!.filter(f => f.host !== host));

                    handleErrorMessage(t("forwards.CreateForwardError"))(error);
                });
        }

        onClose();
    };

    return (
        <Modal opened={show} onClose={onClose} title={isEditMode ? t("forwards.EditForward") : t("forwards.CreateForward")}>
            <form className="flex flex-col gap-2" onSubmit={onFormSubmit}>
                <TextInput
                    required
                    disabled={!!forward}
                    label={t("common.Host")}
                    value={host}
                    onChange={event => setHost(event.currentTarget.value)}
                />

                <Checkbox
                    label={t("common.Frame")}
                    checked={frame}
                    onChange={event => setFrame(event.currentTarget.checked)}
                />

                <TextInput
                    required
                    label={t("common.Url")}
                    value={url}
                    onChange={event => { setUrl(event.currentTarget.value); setUrlError(null); }}
                    error={urlError}
                />

                <div className="mt-4 flex justify-end gap-2">
                    <Button variant="subtle" leftSection={<IconChevronLeft />} onClick={() => onClose()}>
                        {t("common.Cancel")}
                    </Button>

                    <Button leftSection={<IconDeviceFloppy />} type="submit">
                        {t("common.Save")}
                    </Button>
                </div>
            </form>
        </Modal>
    )
};

export default CreateEditForwardModal;