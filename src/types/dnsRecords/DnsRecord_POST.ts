import DnsRecordType from "./DnsRecordType";

type DnsRecord_POST = {
    host: string;
    ttl?: number;
    type: DnsRecordType;
    data: string;
    priority?: number;
    weight?: number;
    port?: number;
};

export default DnsRecord_POST;