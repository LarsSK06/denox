import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordPostModel from "@/types/dnsRecords/DnsRecordPostModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import Endpoint from "@/types/http/Endpoint";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { Button, Modal, NumberInput, Select, TextInput } from "@mantine/core";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useMemo, useState } from "react";

type CreateEditDnsRecordModalProps = {
    show?: boolean;
    domainId: number;
    dnsRecord: DnsRecordGetModel | null;
    refresh?: () => any;
    onClose: () => any;
};

const CreateEditDnsRecordModal = ({ show, domainId, dnsRecord, refresh, onClose }: CreateEditDnsRecordModalProps) => {
    const [localDnsRecord, setLocalDnsRecord] = useState<DnsRecordGetModel | null>(null);

    const [host, setHost] = useState<string>("@");
    const [ttl, setTtl] = useState<number>(3600);
    const [type, setType] = useState<DnsRecordType>(DnsRecordType.A);
    const [data, setData] = useState<string>("");
    const [priority, setPriority] = useState<number>(10);
    const [weight, setWeight] = useState<number>(0);
    const [port, setPort] = useState<number>(0);

    useEffect(() => {
        if (dnsRecord) setLocalDnsRecord(dnsRecord);
        else setTimeout(() => setLocalDnsRecord(null), 300);
    }, [dnsRecord]);

    useEffect(() => {
        setHost(localDnsRecord?.host ?? "@");
        setTtl(localDnsRecord?.ttl ?? 3600);
        setType(localDnsRecord?.type ?? DnsRecordType.A);
        setData(localDnsRecord?.data ?? "");
        setPriority(localDnsRecord?.priority ?? 10);
        setWeight(localDnsRecord?.weight ?? 0);
        setPort(localDnsRecord?.port ?? 0);
    }, [localDnsRecord]);

    const {
        isLoading: isCreateDnsRecordLoading,
        call: createDnsRecord
    } = useHttpClient<{}, DnsRecordPostModel>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS],
        method: "POST",
        body: {
            host,
            ttl,
            type,
            data,
            priority,
            weight,
            port
        }
    });

    const handleSave = () => {
        createDnsRecord()
            .then(() => {
                handleClose();
                refresh?.();
            })
            .catch(handleErrorMessage(t("dnsRecords.CreateDnsRecordError")))
    };

    const handleClose = () => {
        setTimeout(() => {
            setHost("@");
            setTtl(3600);
            setType(DnsRecordType.A);
            setData("");
            setPriority(10);
            setWeight(0);
            setPort(0);
        }, 300);

        onClose();
    };

    const isPriorityRequired = useMemo(() => [DnsRecordType.MX, DnsRecordType.SRV].includes(type), [type]);
    const isWeightRequired = useMemo(() => type === DnsRecordType.SRV, [type]);
    const isPortRequired = useMemo(() => type === DnsRecordType.SRV, [type]);

    return (
        <Modal
            centered
            opened={!!show}
            onClose={handleClose}
            title={t("dnsRecords.NewDnsRecord")}>
            <form className="flex flex-col items-start gap-4">
                <Select
                    required
                    className="w-full"
                    label={t("common.Type")}
                    value={type}
                    onChange={value => setType(value as DnsRecordType)}
                    data={Object.values(DnsRecordType).filter(i => typeof i === "string")}
                />

                <TextInput
                    required
                    className="w-full"
                    label={t("common.Host")}
                    value={host}
                    onChange={event => setHost(event.currentTarget.value)}
                />

                <NumberInput
                    required
                    className="w-full"
                    label={t("common.Ttl")}
                    value={ttl}
                    onChange={value => setTtl(Number(value))}
                />

                <TextInput
                    required
                    className="w-full"
                    label={t("common.Data")}
                    value={data}
                    onChange={event => setData(event.currentTarget.value)}
                />

                {isPriorityRequired ? (
                    <NumberInput
                        required
                        className="w-full"
                        label={t("common.Priority")}
                        value={priority}
                        onChange={value => setPriority(Number(value))}
                    />
                ) : null}

                {isWeightRequired ? (
                    <NumberInput
                        required
                        className="w-full"
                        label={t("common.Weight")}
                        value={weight}
                        onChange={value => setWeight(Number(value))}
                    />
                ) : null}

                {isPortRequired ? (
                    <NumberInput
                        required
                        className="w-full"
                        label={t("common.Port")}
                        value={port}
                        onChange={value => setPort(Number(value))}
                    />
                ) : null}

                <div className="w-full mt-4 flex justify-end gap-2">
                    <Button leftSection={<IconChevronLeft />} onClick={() => handleClose()} loading={isCreateDnsRecordLoading} variant="subtle">
                        {t("common.Cancel")}
                    </Button>
    
                    <Button
                        className="transition-colors"
                        leftSection={<IconDeviceFloppy />}
                        onClick={() => handleSave()}
                        loading={isCreateDnsRecordLoading}
                        disabled={
                            !host ||
                            !ttl ||
                            !data ||
                            (isPriorityRequired && !priority) ||
                            (isWeightRequired && !weight) ||
                            (isPortRequired && !port)
                        }>
                        {t("common.Save")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateEditDnsRecordModal;