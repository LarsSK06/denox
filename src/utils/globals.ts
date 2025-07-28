import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import DomainGetModel from "@/types/domains/DomainGetModel";
import DomainStatus from "@/types/domains/DomainStatus";
import DomainWebHotelSize from "@/types/domains/DomainWebHotelSize";

export const dbConnectionString = "sqlite:appdata.sqlite";
export const invalidContextUsageError = "Context cannot be used outside its own provider!";
export const windowTitleRoot = "Denox";
export const windowTitleTemplate = `%t% - ${windowTitleRoot}`;
export const settingsFileName = "settings.json";

export const dummyDomain = {
    id: -1,
    domain: "example.com",
    expiryDate: new Date(),
    registeredDate: new Date(),
    renew: false,
    registrant: "John Doe",
    status: DomainStatus.Deactivated,
    nameservers: [
        "nr1.ns",
        "nr2.ns"
    ],
    services: {
        registrar: true,
        dns: true,
        email: false,
        webhotel: DomainWebHotelSize.None
    }
} satisfies DomainGetModel as DomainGetModel;

export const dummyDnsRecord = {
    id: -1,
    host: "@",
    type: DnsRecordType.A,
    data: "0.0.0.0"
} satisfies DnsRecordGetModel as DnsRecordGetModel;