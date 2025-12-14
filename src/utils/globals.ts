import DnsRecord_GET from "@/types/dnsRecords/DnsRecord_GET";
import DnsRecordType from "@/types/dnsRecords/DnsRecordType";
import Domain_GET from "@/types/domains/Domain_GET";
import DomainStatus from "@/types/domains/DomainStatus";
import DomainWebHotelSize from "@/types/domains/DomainWebHotelSize";

export const dbConnectionString = "sqlite:appdata.sqlite";
export const invalidContextUsageError = "Context cannot be used outside its own provider!";
export const settingsFileName = "settings.json";
export const lastProfileIdCacheKey = "last-profile-id";
export const domainSidebarWidthCacheKey = "domain-sidebar-width";

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
} satisfies Domain_GET as Domain_GET;

export const dummyDnsRecord = {
    id: -1,
    host: "@",
    type: DnsRecordType.A,
    data: "0.0.0.0"
} satisfies DnsRecord_GET as DnsRecord_GET;