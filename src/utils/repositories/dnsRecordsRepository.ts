import { useState } from "react";
import { t } from "i18next";

import useHttpClient from "../hooks/useHttpClient";
import DnsRecord_GET from "@/types/dnsRecords/DnsRecord_GET";
import Endpoint from "@/types/http/Endpoint";
import DnsRecord_POST from "@/types/dnsRecords/DnsRecord_POST";
import handleErrorMessage from "../functions/handleErrorMessage";
import DnsRecord_PUT from "@/types/dnsRecords/DnsRecord_PUT";

type UseDnsRecordsRepository = {
    domainId: number;
};

const useDnsRecordsRepository = ({ domainId }: UseDnsRecordsRepository) => {
    
    const {
        isLoading: isDnsRecordsLoading,
        data: dnsRecords,
        call: getDnsRecords,
        setData: setDnsRecords
    } = useHttpClient<DnsRecord_GET[]>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS]
    });


    const {
        isLoading: _isCreateDnsRecordLoading,
        call: _createDnsRecord
    } = useHttpClient<{ id: number }, DnsRecord_POST>(([body, _domainId]) => ({
        endpoint: [Endpoint.Domains, _domainId ?? domainId, Endpoint.DNS],
        method: "POST",
        body
    }));

    const [isCreateDnsRecordLoading, setIsCreateDnsRecordLoading] = useState<boolean>(false);

    const createDnsRecord = (dnsRecord: DnsRecord_POST) => new Promise<boolean>(resolve => {
        setIsCreateDnsRecordLoading(true);

        const syntheticId = Date.now() + .1;

        setDnsRecords(prev => [
            ...prev!,
            {
                id: syntheticId,
                ...dnsRecord
            }
        ]);

        _createDnsRecord(dnsRecord)
            .then(({ id: createdDnsRecordId }) => {
                setDnsRecords(prev => prev!.map(dr =>
                    dr.id === syntheticId ? {
                        ...dr,
                        id: createdDnsRecordId
                    } : dr
                ));

                resolve(true);
            })
            .catch(error => {
                setDnsRecords(prev => prev!.filter(dr => dr.id !== syntheticId));

                handleErrorMessage(t("dnsRecords.CreateDnsRecordError"))(error);

                resolve(false);
            })
            .finally(() => setIsCreateDnsRecordLoading(false));
    });


    const {
        isLoading: _isEditDnsRecordLoading,
        call: _editDnsRecord
    } = useHttpClient<{}, DnsRecord_PUT>(([id, body]) => ({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS, id],
        method: "PUT",
        body
    }));

    const [isEditDnsRecordLoading, setIsEditDnsRecordLoading] = useState<boolean>(false);

    const editDnsRecord = (dnsRecordId: number, dnsRecord: Partial<DnsRecord_PUT>) => new Promise<boolean>(resolve => {
        setIsEditDnsRecordLoading(true);

        const snapshot = structuredClone(dnsRecords!.find(dr => dr.id === dnsRecordId)!);

        setDnsRecords(prev => prev!.map(dr =>
            dr.id === dnsRecordId ? {
                ...snapshot,
                ...dnsRecord
            } : dr
        ));

        _editDnsRecord(dnsRecordId, { ...snapshot, ...dnsRecord })
            .then(() => resolve(true))
            .catch(error => {
                setDnsRecords(prev => prev!.map(dr =>
                    dr.id === dnsRecordId
                        ? snapshot
                        : dr
                ));

                handleErrorMessage(t("dnsRecords.EditDnsRecordError"))(error);

                resolve(false);
            })
            .finally(() => setIsEditDnsRecordLoading(false));
    });


    const { call: deleteDnsRecord } = useHttpClient<{}, DnsRecord_PUT>(id => ({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS, id],
        method: "DELETE"
    }));

    const [isDeleteDnsRecordsLoading, setIsDeleteDnsRecordsLoading] = useState<boolean>(false);

    const deleteDnsRecords = (dnsRecordIds: number[]) => new Promise<boolean>(resolve => {
        setIsDeleteDnsRecordsLoading(true);

        const snapshots = structuredClone(dnsRecords!.filter(dr => dnsRecordIds.includes(dr.id)));

        setDnsRecords(prev => prev!.filter(dr => !dnsRecordIds.includes(dr.id)));

        Promise.all(
            dnsRecordIds.map(id =>
                new Promise<void>((subresolve, subreject) => {
                    deleteDnsRecord(id)
                        .then(() => subresolve())
                        .catch(error => {
                            setDnsRecords(prev => [
                                ...prev!,
                                snapshots.find(s => s.id === id)!
                            ]);

                            handleErrorMessage(t("dnsRecords.DeleteDnsRecordError"))(error);

                            subreject();
                        });
                })
            )
        )
            .then(() => resolve(true))
            .catch(() => resolve(false))
            .finally(() => setIsDeleteDnsRecordsLoading(false));
    });


    const [isDuplicateDnsRecordsLoading, setIsDuplicateDnsRecordsLoading] = useState<boolean>(false);

    const duplicateDnsRecords = (dnsRecordIds: number[], _domainId: number) => new Promise<boolean>(resolve => {
        setIsDuplicateDnsRecordsLoading(true);

        Promise.all(
            dnsRecordIds.map(id => dnsRecords!.find(dr => dr.id === id)).filter(dr => !!dr).map(dr =>
                new Promise<void>((subresolve, subreject) => {
                    _createDnsRecord(dr, _domainId)
                        .then(() => subresolve())
                        .catch(error => {
                            handleErrorMessage(t("dnsRecords.DuplicateDnsRecordError"))(error);

                            subreject();
                        });
                })
            )
        )
            .then(() => resolve(true))
            .catch(() => resolve(false))
            .finally(() => setIsDuplicateDnsRecordsLoading(false));
    });


    return {
        isDnsRecordsLoading,
        dnsRecords,
        getDnsRecords: () => getDnsRecords(),

        isCreateDnsRecordLoading,
        createDnsRecord,

        isEditDnsRecordLoading,
        editDnsRecord,

        isDeleteDnsRecordsLoading,
        deleteDnsRecords,

        isDuplicateDnsRecordsLoading,
        duplicateDnsRecords
    };
};

export default useDnsRecordsRepository;