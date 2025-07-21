import DnsRecordType from "./DnsRecordType";

type DnsRecordGetModel = {
    id: number;
    host: string;
    ttl?: number;
    type: DnsRecordType;
    data: string;
    priority?: number;
    weight?: number;
    port?: number;
};

export default DnsRecordGetModel;