import DomainActiveState from "./DomainActiveState";
import DomainWebHotelSize from "./DomainWebHotelSize";

type DomainGetModel = {
    id: number;
    domain: string;
    expiryDate: Date;
    registeredDate: Date;
    renew: boolean;
    registrant: string;
    status: DomainActiveState;
    nameservers: [
        string,
        string,
        ...string[]
    ];
    services: {
        registrar: boolean;
        dns: boolean;
        email: boolean;
        webhotel: DomainWebHotelSize;
    };
};

export default DomainGetModel;