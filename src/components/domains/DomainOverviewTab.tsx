"use client";

import { Paper, Table, Text, Transition } from "@mantine/core";
import { dummyDomain } from "@/utils/globals";
import { useEffect } from "react";
import { t } from "i18next";

import DomainPeriodProgressCircle from "./DomainPeriodProgressCircle";
import DomainStatusChip from "./DomainStatusChip";
import DomainWebHotelSizeChip from "./DomainWebHotelSizeChip";
import Check from "../common/Check";
import useSearchParam from "@/utils/hooks/useSearchParam";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Loader from "../common/Loader";

const DomainOverviewTab = () => {

    const domainId = useSearchParam({ key: "domainId", type: "number" });

    const {
        data: domain,
        call: getDomain
    } = useHttpClient<DomainGetModel>({
        endpoint: [Endpoint.Domains, domainId],
        process: body => ({
            ...body,
            registeredDate: new Date(body.registeredDate),
            expiryDate: new Date(body.expiryDate)
        })
    });

    useEffect(() => {
        if (!domainId) return;

        getDomain();
    }, [domainId]);

    return (
        <div className="w-full h-full relative">
            <Transition mounted={!!domain} transition="fade-right">
                {style => (
                    <div className="w-full h-full p-2 flex flex-col items-center gap-8 overflow-auto" style={style}>
                        <DomainPeriodProgressCircle domain={domain ?? dummyDomain} />

                        <Text component="h2" size="xl" aria-hidden>
                            {domain?.domain ?? dummyDomain.domain}
                        </Text>

                        <Paper withBorder shadow="sm" className="w-full">
                            <Text className="p-2" component="h3" size="lg">
                                {t("common.Services")}
                            </Text>

                            <Table>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Registrant")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            {domain?.registrant}
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Status")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <DomainStatusChip status={domain?.status ?? dummyDomain.status} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.WebHotel")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <DomainWebHotelSizeChip size={domain?.services.webhotel ?? dummyDomain.services.webhotel} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Renew")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <Check mode={domain?.renew ? "true" : "false"} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Registrar")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <Check mode={domain?.services.registrar ? "true" : "false"} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.DNS")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <Check mode={domain?.services.dns ? "true" : "false"} />
                                        </Table.Td>
                                    </Table.Tr>

                                    <Table.Tr>
                                        <Table.Th>
                                            {t("common.Email")}
                                        </Table.Th>

                                        <Table.Td align="right">
                                            <Check mode={domain?.services.email ? "true" : "false"} />
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        </Paper>

                        <Paper withBorder shadow="sm" className="w-full">
                            <Text className="p-2" component="h3" size="lg">
                                {t("common.Nameservers")}
                            </Text>

                            <Table aria-hidden>
                                <Table.Tbody>
                                    {(domain?.nameservers ?? dummyDomain.nameservers).map((ns, i) => (
                                        <Table.Tr key={i}>
                                            <Table.Th>
                                                {i + 1}
                                            </Table.Th>

                                            <Table.Td align="right">
                                                {ns}
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>

                            <ol className="sr-only">
                                {(domain?.nameservers ?? dummyDomain.nameservers).map((ns, i) => (
                                    <li key={i}>
                                        {ns}
                                    </li>
                                ))}
                            </ol>
                        </Paper>
                    </div>
                )}
            </Transition>

            <Transition mounted={!domain} transition="fade-right">
                {style => (
                    <div className="w-full h-full left-0 top-0 flex justify-center items-center absolute" style={style}>
                        <Loader />
                    </div>
                )}
            </Transition>
        </div>
    );
};

export default DomainOverviewTab;