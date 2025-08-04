import ForwardGetModel from "@/types/forwards/ForwardGetModel";
import ForwardPostModel from "@/types/forwards/ForwardPostModel";
import ForwardPutModel from "@/types/forwards/ForwardPutModel";
import Endpoint from "@/types/http/Endpoint";
import { useDomainForwardsContext } from "@/utils/contexts/useDomainForwardsContext";
import { usePositionContext } from "@/utils/contexts/usePositionContext";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { Button, Checkbox, Modal, TextInput } from "@mantine/core";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useState } from "react";

type CreateEditForwardModalProps = {
    show?: boolean;
    onClose: () => any;
    forward: ForwardGetModel | null;
};

const CreateEditForwardModal = ({ show, onClose, forward }: CreateEditForwardModalProps) => {
    const [host, setHost] = useState<string>(forward?.host ?? "");
    const [frame, setFrame] = useState<boolean>(forward?.frame ?? false);
    const [url, setUrl] = useState<string>(forward?.url ?? "");

    const [hostError, setHostError] = useState<string | null>(null);
    const [urlError, setUrlError] = useState<string | null>(null);

    const { forwards, setForwards } = useDomainForwardsContext();
    const { domainId } = usePositionContext();

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

    useEffect(() => {
        if (show) return;

        setTimeout(() => {
            setHost("");
            setFrame(false);
            setUrl("");

            setHostError(null);
            setUrlError(null);
        }, 300);
    }, [show]);

    useEffect(() => {
        setHost(forward?.host ?? "");
        setFrame(forward?.frame ?? false);
        setUrl(forward?.url ?? "");
    }, [forward]);

    const validateForm = () => {
        if (!forward && forwards?.some(f => f.host.toLowerCase() === host.toLowerCase())) {
            setHostError(t("other.HostForwardConflict"));

            return false;
        }

        try { const _ = new URL(url); }
        catch {
            setUrlError(t("other.UrlNotValid"));

            return false;
        }

        return true;
    };

    const onFormSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();

        if (!validateForm()) return;

        if (forward) {
            const forwardSnapshot = structuredClone(forwards!.find(f => f.host === forward.host))!;

            setForwards(prev => [
                ...prev!.filter(f => f.host !== forward.host),
                {
                    host,
                    frame,
                    url
                }
            ]);

            editForward().catch(error => {
                setForwards(prev => [
                    ...prev!.filter(f => f.host !== forward.host),
                    forwardSnapshot
                ]);

                handleErrorMessage(t("forwards.EditForwardError"))(error);
            });
        }
        else {
            const hostSnapshot = structuredClone(host);

            setForwards(prev => [
                ...prev!,
                {
                    host: hostSnapshot,
                    frame,
                    url
                }
            ]);

            createForward().catch(error => {
                setForwards(prev => prev!.filter(f => f.host !== hostSnapshot));

                handleErrorMessage(t("forwards.CreateForwardError"))(error);
            });
        }

        onClose();
    };

    return (
        <Modal opened={!!show} onClose={onClose} title={forward ? t("forwards.EditForward") : t("forwards.CreateForward")}>
            <form className="flex flex-col gap-2" onSubmit={onFormSubmit}>
                <TextInput
                    autoFocus
                    disabled={!!forward}
                    label={t("common.Host")}
                    value={host}
                    onChange={event => { setHost(event.currentTarget.value); setHostError(null); }}
                    error={hostError}
                />

                <Checkbox
                    label={t("common.Frame")}
                    checked={frame}
                    onChange={event => setFrame(event.currentTarget.checked)}
                />

                <TextInput
                    label={t("common.Url")}
                    value={url}
                    onChange={event => { setUrl(event.currentTarget.value); setUrlError(null); }}
                    error={urlError}
                />

                <div className="flex justify-end gap-2">
                    <Button leftSection={<IconChevronLeft />} variant="light" onClick={() => onClose()}>
                        {t("common.Cancel")}
                    </Button>
                    
                    <Button leftSection={<IconDeviceFloppy />} type="submit">
                        {t("common.Save")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateEditForwardModal;