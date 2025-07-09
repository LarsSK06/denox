"use client";

import ParentProps from "@/types/common/ParentProps";
import Endpoint from "@/types/http/Endpoint";
import useApi from "@/utils/hooks/useApi";

import { Table } from "@mantine/core";
import { t } from "i18next";
import { useEffect } from "react";

const Layout = ({ children }: ParentProps) => {

    const {
        isLoading: isDomainsLoading,
        data: domains,
        call: getDomains
    } = useApi({
        endpoint: Endpoint.Domains
    });

    useEffect(() => {
        getDomains();
    }, []);

    return (
        <div className="flex p-2 gap-2">
            <aside>
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Td className="font-bold">
                                {t("domains.DomainName")}
                            </Table.Td>

                            <Table.Td className="w-0 font-bold">
                                {t("common.Renew")}
                            </Table.Td>

                            <Table.Td>
                                <span className="sr-only">
                                    {t("common.Open")}
                                </span>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Thead>
                </Table>
            </aside>

            <main>
                {children}
            </main>
        </div>
    );
};

export default Layout;