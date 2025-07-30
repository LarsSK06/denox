import DomainWebHotelSizeChip from "./DomainWebHotelSizeChip";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Check from "../common/Check";

import { Paper, Table, Text } from "@mantine/core";
import { t } from "i18next";

type DomainServicesContainerProps = {
    domain: DomainGetModel;
};

const DomainServicesContainer = ({ domain }: DomainServicesContainerProps) => (
    <Paper withBorder shadow="sm" className="p-2">
        <Text size="xl">
            {t("common.Services")}
        </Text>

        <Table>
            <Table.Tbody>
                <Table.Tr>
                    <Table.Th>
                        {t("common.Email")}
                    </Table.Th>

                    <Table.Td className="w-0">
                        <Check mode={domain.services.email ? "true" : "false"} />
                    </Table.Td>
                </Table.Tr>

                <Table.Tr>
                    <Table.Th>
                        {t("common.Registrar")}
                    </Table.Th>

                    <Table.Td className="w-0">
                        <Check mode={domain.services.registrar ? "true" : "false"} />
                    </Table.Td>
                </Table.Tr>

                <Table.Tr>
                    <Table.Th>
                        {t("common.DNS")}
                    </Table.Th>

                    <Table.Td className="w-0">
                        <Check mode={domain.services.dns ? "true" : "false"} />
                    </Table.Td>
                </Table.Tr>

                <Table.Tr>
                    <Table.Th>
                        {t("common.WebHotel")}
                    </Table.Th>

                    <Table.Td className="w-0">
                        <DomainWebHotelSizeChip size={domain.services.webhotel} />
                    </Table.Td>
                </Table.Tr>
            </Table.Tbody>
        </Table>
    </Paper>
);

export default DomainServicesContainer;