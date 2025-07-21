import DnsRecordType from "./DnsRecordType";

type DnsRecordPostModel = {
    host: string;
    ttl?: number;
    type: DnsRecordType;
    data: string;
    priority?: number;
    weight?: number;
    port?: number;
};

export default DnsRecordPostModel;