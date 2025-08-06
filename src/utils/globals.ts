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
export const lastProfileIdCacheKey = "last-profile-id";
export const ipv4Regex = /(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}/;
export const ipv6Regex = /(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))/;

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