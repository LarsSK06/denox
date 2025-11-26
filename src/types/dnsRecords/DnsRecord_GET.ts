import DnsRecordType from "./DnsRecordType";

type DnsRecord_GET = {
    id: number;
    host: string;
    ttl?: number;
    type: DnsRecordType;
    data: string;
    /**
     * Exclusively for:
     * - MX
     * - SRV
     */
    priority?: number;
    /**
     * Exclusively for:
     * - SRV
     */
    weight?: number;
    /**
     * Exclusively for:
     * - SRV
     */
    port?: number;
};

export default DnsRecord_GET;