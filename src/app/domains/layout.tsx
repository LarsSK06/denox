"use client";

import TableBodySkeleton from "@/components/common/TableBodySkeleton";
import ParentProps from "@/types/common/ParentProps";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";

import { Table } from "@mantine/core";
import { IconCircleCheck, IconCircleX } from "@tabler/icons-react";
import { useEffect } from "react";
import { t } from "i18next";

const Layout = ({ children }: ParentProps) => {

    const {
        isLoading: isDomainsLoading,
        data: domains,
        call: getDomains
    } = useHttpClient<DomainGetModel[]>({
        endpoint: Endpoint.Domains
    });

    useEffect(() => {
        getDomains().catch(() => {});
    }, []);

    const isEmpty = !isDomainsLoading && !domains;

    return (
        <div className="flex p-2 gap-2">
            <aside>
                {isEmpty ? (
                    <div className="w-full h-full">
                        Empty or error ???
                    </div>
                ) : (
                    <Table>
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Td className="font-bold">
                                    {t("domains.DomainName")}
                                </Table.Td>

                                <Table.Td className="w-0 font-bold">
                                    {t("common.Renew")}
                                </Table.Td>

                                <Table.Td className="w-0">
                                    <span className="sr-only">
                                        {t("common.Open")}
                                    </span>
                                </Table.Td>
                            </Table.Tr>
                        </Table.Thead>

                        {console.log(domains)}

                        <Table.Tbody>
                            {isDomainsLoading ? (
                                <TableBodySkeleton rows={5} columns={3} />
                            ) : (
                                domains?.map(domain => (
                                    <Table.Tr>
                                        <Table.Td>
                                            {domain.domain}
                                        </Table.Td>

                                        <Table.Td>
                                            {domain.renew ? (
                                                <>
                                                    <IconCircleCheck aria-hidden color="green" />

                                                    <span className="sr-only">
                                                        {t("common.Yes")}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <IconCircleX aria-hidden color="red" />

                                                    <span className="sr-only">
                                                        {t("common.No")}
                                                    </span>
                                                </>
                                            )}
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            )}
                        </Table.Tbody>
                    </Table>
                )}
            </aside>

            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;