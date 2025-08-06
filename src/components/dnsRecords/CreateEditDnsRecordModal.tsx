import Endpoint from "@/types/http/Endpoint";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";
import useHttpClient from "@/utils/hooks/useHttpClient";
import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import DnsRecordPostModel from "@/types/dnsRecords/DnsRecordPostModel";
import DnsRecordPutModel from "@/types/dnsRecords/DnsRecordPutModel";

import { Button, Modal, NumberInput, Select, Textarea, TextInput } from "@mantine/core";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { usePositionContext } from "@/utils/contexts/usePositionContext";
import { t } from "i18next";
import { useDomainDnsRecordsContext } from "@/utils/contexts/useDomainDnsRecordsContext";
import { ipv4Regex, ipv6Regex } from "@/utils/globals";


type CreateEditDnsRecordModalProps = {
    show?: boolean;
    onClose: () => any;
    dnsRecord: DnsRecordGetModel | null;
};

const CreateEditDnsRecordModal = ({ show, onClose, dnsRecord }: CreateEditDnsRecordModalProps) => {
    const [host, setHost] = useState<string>(dnsRecord?.host ?? "");
    const [ttl, setTtl] = useState<number>(dnsRecord?.ttl ?? 3600);
    const [type, setType] = useState<DnsRecordType>(dnsRecord?.type ?? DnsRecordType.A);
    const [data, setData] = useState<string>(dnsRecord?.data ?? "");
    const [priority, setPriority] = useState<number>(dnsRecord?.priority ?? 10);
    const [weight, setWeight] = useState<number>(dnsRecord?.priority ?? 0);
    const [port, setPort] = useState<number>(dnsRecord?.port ?? 0);

    const [hostError, setHostError] = useState<string | null>(null);
    const [ttlError, setTtlError] = useState<string | null>(null);
    const [dataError, setDataError] = useState<string | null>(null);

    const { dnsRecords, setDnsRecords } = useDomainDnsRecordsContext();
    const { domainId } = usePositionContext();

    const { call: createDnsRecord } = useHttpClient<{}, DnsRecordPostModel>({
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

    const { call: editDnsRecord } = useHttpClient<{}, DnsRecordPutModel>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS, dnsRecord?.id],
        method: "PUT",
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

    useEffect(() => {
        if (show) return;

        setTimeout(() => {
            setHost("")
            setTtl(3600);
            setType(DnsRecordType.A);
            setData("");
            setPriority(10);
            setWeight(0);
            setPort(0);

            setHostError(null);
            setTtlError(null);
            setDataError(null);
        }, 300);
    }, [show]);

    useEffect(() => {
        setHost(dnsRecord?.host ?? "")
        setTtl(dnsRecord?.ttl ?? 3600);
        setType(dnsRecord?.type ?? DnsRecordType.A);
        setData(dnsRecord?.data ?? "");
        setPriority(dnsRecord?.priority ?? 10);
        setWeight(dnsRecord?.weight ?? 0);
        setPort(dnsRecord?.port ?? 0);
    }, [dnsRecord]);

    const validateForm = () => {
        if (ttl % 60 !== 0) {
            setTtlError(t("other.ValueMustBeDivisibleBy", { count: 60 }));

            return false;
        }

        switch (type) {
            case DnsRecordType.A:
                if (!ipv4Regex.test(data)) {
                    setDataError(t("other.ValueMustBeAValidIpv4Address"));

                    return false;
                }
                else break;

            case DnsRecordType.AAAA:
                if (!ipv6Regex.test(data)) {
                    setDataError(t("other.ValueMustBeAValidIpv6Address"));

                    return false;
                }
                else break;

            case DnsRecordType.MX:
            case DnsRecordType.SRV:
            case DnsRecordType.TXT:
            case DnsRecordType.CNAME:
        }

        return true;
    };

    const onFormSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();

        if (!validateForm()) return;

        if (dnsRecord) {
            const dnsRecordSnapshot = structuredClone(dnsRecords!.find(f => f.id === dnsRecord.id))!;

            setDnsRecords(prev => [
                ...prev!.filter(f => f.id !== dnsRecord.id),
                {
                    id: dnsRecordSnapshot.id,
                    host,
                    ttl,
                    type,
                    data,
                    priority,
                    weight,
                    port
                }
            ]);

            editDnsRecord().catch(error => {
                setDnsRecords(prev => [
                    ...prev!.filter(f => f.id !== dnsRecord.id),
                    dnsRecordSnapshot
                ]);

                handleErrorMessage(t("dnsRecords.EditDnsRecordError"))(error);
            });
        }
        else {
            const idSnapshot = Date.now();

            setDnsRecords(prev => [
                ...prev!,
                {
                    id: idSnapshot,
                    host,
                    ttl,
                    type,
                    data,
                    priority,
                    weight,
                    port
                }
            ]);

            createDnsRecord().catch(error => {
                setDnsRecords(prev => prev!.filter(f => f.id !== idSnapshot));

                handleErrorMessage(t("forwards.CreateDnsRecordsError"))(error);
            });
        }

        onClose();
    };

    const dataPlaceholder = useMemo<string>(() => {
        switch (type) {
            case DnsRecordType.A: return t("common.Ipv4Address");
            case DnsRecordType.AAAA: return t("common.Ipv6Address");
            case DnsRecordType.MX:
            case DnsRecordType.SRV:
            case DnsRecordType.TXT:
            case DnsRecordType.CNAME:

            default: return "...";
        }
    }, [type]);

    return (
        <Modal opened={!!show} onClose={onClose} title={dnsRecord ? t("dnsRecords.EditDnsRecord") : t("dnsRecords.CreateDnsRecord")}>
            <form className="flex flex-col gap-2" onSubmit={onFormSubmit}>
                <TextInput
                    autoFocus
                    required
                    label={t("common.Host")}
                    value={host}
                    onChange={event => { setHost(event.currentTarget.value); setHostError(null); }}
                    onBlur={() => { if (host.trim() === "") setHost("@"); }}
                    error={hostError}
                />

                <NumberInput
                    required
                    label={t("common.Ttl")}
                    value={ttl}
                    onChange={value => { setTtl(Number(value)); setTtlError(null); }}
                    error={ttlError}
                    min={0}
                />

                <Select
                    required
                    label={t("common.Type")}
                    value={type}
                    onChange={value => setType(value as DnsRecordType)}
                    data={Object.values(DnsRecordType).filter(t => typeof t === "string")}
                />

                <Textarea
                    required
                    label={t("common.Data")}
                    placeholder={dataPlaceholder}
                    value={data}
                    onChange={event => { setData(event.currentTarget.value); setDataError(null); }}
                    error={dataError}
                />

                {type === DnsRecordType.MX || type === DnsRecordType.SRV ? (
                    <NumberInput
                        required
                        label={t("common.Priority")}
                        value={priority}
                        onChange={value => setPriority(Number(value))}
                    />
                ) : null}

                {type === DnsRecordType.SRV ? (
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

export default CreateEditDnsRecordModal;