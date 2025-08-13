import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import useHttpClient from "@/utils/hooks/useHttpClient";
import DnsRecordPostModel from "@/types/dnsRecords/DnsRecordPostModel";
import Endpoint from "@/types/http/Endpoint";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import DnsRecordPutModel from "@/types/dnsRecords/DnsRecordPutModel";

import { Button, Modal, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { t } from "i18next";

type CreateEditDnsRecordModalProps = {
    show: boolean;
    onClose: () => unknown;
    domainId: number;
    dnsRecord: DnsRecordGetModel | null;
    setDnsRecords: Dispatch<SetStateAction<DnsRecordGetModel[] | null>>;
};

const CreateEditDnsRecordModal = ({ show, onClose, domainId, dnsRecord, setDnsRecords }: CreateEditDnsRecordModalProps) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(!!dnsRecord);

    const [host, setHost] = useState<string>("@");
    const [ttl, setTtl] = useState<number>(3600);
    const [type, setType] = useState<DnsRecordType>(DnsRecordType.A);
    const [data, setData] = useState<string>("");
    const [priority, setPriority] = useState<number>(10);
    const [weight, setWeight] = useState<number>(0);
    const [port, setPort] = useState<number>(0);

    const [ttlError, setTtlError] = useState<string | null>(null);

    const setValues = () => {
        setIsEditMode(!!dnsRecord);
    
        setHost(dnsRecord?.host ?? "@");
        setTtl(dnsRecord?.ttl ?? 3600);
        setType(dnsRecord?.type ?? DnsRecordType.A);
        setData(dnsRecord?.data ?? "");
        setPriority(dnsRecord?.priority ?? 10);
        setWeight(dnsRecord?.weight ?? 0);
        setPort(dnsRecord?.port ?? 0);
    };

    useEffect(() => {
        if (dnsRecord) setValues();
        else setTimeout(setValues, 300);
    }, [dnsRecord]);
    
    useEffect(() => {
        if (show) setValues();
        else setTimeout(setValues, 300);
    }, [show]);

    const showPriority = useMemo<boolean>(() =>
        type === DnsRecordType.MX ||
        type === DnsRecordType.SRV
    , [type]);

    const showWeightAndPort = useMemo<boolean>(() => type === DnsRecordType.SRV, [type]);

    const { call: createDnsRecord } = useHttpClient<{}, DnsRecordPostModel>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS],
        method: "POST",
        body: {
            host,
            ttl,
            type,
            data,
            priority: showPriority ? priority : undefined,
            weight: showWeightAndPort ? weight : undefined,
            port: showWeightAndPort ? port : undefined
        }
    });

    const { call: editDnsRecord } = useHttpClient<{}, DnsRecordPutModel>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS, dnsRecord?.id],
        method: "PUT",
        body: {
            host,
            ttl,
            type,
            data,
            priority: showPriority ? priority : undefined,
            weight: showWeightAndPort ? weight : undefined,
            port: showWeightAndPort ? port : undefined
        }
    });

    const onFormSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();

        if (ttl % 60 !== 0) {
            setTtlError(t("other.ValueMustBeDivisibleBy", { count: 60 }));

            return;
        }

        if (dnsRecord) {
            setDnsRecords(prev => [
                ...prev!.filter(r => r.id !== dnsRecord.id),
                {
                    id: dnsRecord.id,
                    host,
                    ttl,
                    type,
                    data,
                    priority: showPriority ? priority : undefined,
                    weight: showWeightAndPort ? weight : undefined,
                    port: showWeightAndPort ? port : undefined
                }
            ]);

            editDnsRecord()
                .catch(error => {
                    setDnsRecords(prev => [
                        ...prev!.filter(r => r.id !== dnsRecord.id),
                        dnsRecord
                    ]);

                    handleErrorMessage(t("dnsRecords.CreateDnsRecordError"))(error);
                });
        }
        else {
            const syntheticId = Date.now();
    
            setDnsRecords(prev => [
                ...prev!,
                {
                    id: syntheticId,
                    host,
                    ttl,
                    type,
                    data,
                    priority: showPriority ? priority : undefined,
                    weight: showWeightAndPort ? weight : undefined,
                    port: showWeightAndPort ? port : undefined
                }
            ]);

            createDnsRecord()
                .catch(error => {
                    setDnsRecords(prev => prev!.filter(r => r.id !== syntheticId));

                    handleErrorMessage(t("dnsRecords.CreateDnsRecordError"))(error);
                });
        }

        onClose();
    };


    return (
        <Modal opened={show} onClose={onClose} title={isEditMode ? t("dnsRecords.EditDnsRecord") : t("dnsRecords.CreateDnsRecord")}>
            <form className="flex flex-col gap-2" onSubmit={onFormSubmit}>
                <TextInput
                    required
                    label={t("common.Host")}
                    value={host}
                    onChange={event => setHost(event.currentTarget.value)}
                />

                <NumberInput
                    required
                    label={t("common.Ttl")}
                    value={ttl}
                    onChange={value => { setTtl(Number(value)); setTtlError(null); }}
                    error={ttlError}
                />

                <Select
                    required
                    label={t("common.Type")}
                    value={type}
                    onChange={value => setType(value as DnsRecordType)}
                    data={Object.values(DnsRecordType).filter(t => typeof t === "string")}
                />

                <Textarea
                    label={t("common.Data")}
                    value={data}
                    onChange={event => setData(event.currentTarget.value)}
                />

                {showPriority ? (
                    <NumberInput
                        required
                        label={t("common.Priority")}
                        value={priority}
                        onChange={value => setPriority(Number(value))}
                    />
                ) : null}

                {showWeightAndPort ? (
                    <>
                        <NumberInput
                            required
                            label={t("common.Weight")}
                            value={weight}
                            onChange={value => setWeight(Number(value))}
                        />
                    
                        <NumberInput
                            required
                            label={t("common.Port")}
                            value={port}
                            onChange={value => setPort(Number(value))}
                        />
                    </>
                ) : null}

                <div className="mt-4 flex justify-end gap-2">
                    <Button leftSection={<IconChevronLeft />} variant="subtle" onClick={() => onClose()}>
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

export default CreateEditDnsRecordModal;