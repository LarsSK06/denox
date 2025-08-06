import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";
import useHttpClient from "@/utils/hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";
import DnsRecordPostModel from "@/types/dnsRecords/DnsRecordPostModel";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";

import { ActionIcon, Checkbox, Menu, Paper, Table } from "@mantine/core";
import { IconCornerUpRight, IconCornerUpRightDouble, IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";
import { t } from "i18next";
import { useDomainsContext } from "@/utils/contexts/useDomainsContext";
import { usePositionContext } from "@/utils/contexts/usePositionContext";

type DomainDnsRecordCardProps = {
    dnsRecord: DnsRecordGetModel;
    setDnsRecordToEdit: Dispatch<SetStateAction<DnsRecordGetModel | null>>;
    isSelected: boolean;
    toggleSelection: () => any;
};

const DomainDnsRecordCard = ({
    dnsRecord,
    setDnsRecordToEdit,
    isSelected,
    toggleSelection
}: DomainDnsRecordCardProps) => {

    const { call: createDnsRecord } = useHttpClient<{}, DnsRecordPostModel>(domainId => ({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS],
        method: "POST",
        body: dnsRecord
    }));

    const { call: deleteDnsRecord } = useHttpClient<{}, DnsRecordPostModel>(dnsRecordId => ({
        endpoint: [Endpoint.Domains, domainId, Endpoint.DNS],
        method: "DELETE"
    }));

    const { domains } = useDomainsContext();
    const { domainId } = usePositionContext();

    return (
        <Paper withBorder shadow="sm" component="li" className="flex items-center p-2 gap-4 transition-all">
            <Checkbox
                checked={isSelected}
                onChange={() => toggleSelection()}
            />

            <Table>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th className="w-24">
                            {t("common.Host")}
                        </Table.Th>

                        <Table.Td>
                            {dnsRecord.host}
                        </Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th className="w-24">
                            {t("common.Ttl")}
                        </Table.Th>

                        <Table.Td>
                            {dnsRecord.ttl}
                        </Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th className="w-24">
                            {t("common.Type")}
                        </Table.Th>

                        <Table.Td>
                            {dnsRecord.type}
                        </Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th className="w-24">
                            {t("common.Data")}
                        </Table.Th>

                        <Table.Td>
                            {dnsRecord.data}
                        </Table.Td>
                    </Table.Tr>

                    {dnsRecord.priority ? (
                        <Table.Tr>
                            <Table.Th className="w-24">
                                {t("common.Priority")}
                            </Table.Th>

                            <Table.Td>
                                {dnsRecord.priority}
                            </Table.Td>
                        </Table.Tr>
                    ) : null}

                    {dnsRecord.weight ? (
                        <Table.Tr>
                            <Table.Th className="w-24">
                                {t("common.Weight")}
                            </Table.Th>

                            <Table.Td>
                                {dnsRecord.weight}
                            </Table.Td>
                        </Table.Tr>
                    ) : null}

                    {dnsRecord.port ? (
                        <Table.Tr>
                            <Table.Th className="w-24">
                                {t("common.Port")}
                            </Table.Th>

                            <Table.Td>
                                {dnsRecord.port}
                            </Table.Td>
                        </Table.Tr>
                    ) : null}
                </Table.Tbody>
            </Table>

            <Menu>
                <Menu.Target>
                    <ActionIcon variant="subtle" aria-label={t("common.Actions")}>
                        <IconDots />
                    </ActionIcon>
                </Menu.Target>

                <Menu.Dropdown>
                    <Menu.Item leftSection={<IconPencil />} onClick={() => setDnsRecordToEdit(dnsRecord)}>
                        {t("dnsRecords.EditDnsRecord")}
                    </Menu.Item>

                    <Menu.Item leftSection={<IconTrash />} color="red">
                        {t("dnsRecords.DeleteDnsRecord")}
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Sub>
                        <Menu.Sub.Target>
                            <Menu.Sub.Item leftSection={<IconCornerUpRightDouble />}>
                                {t("common.DuplicateTo")}
                            </Menu.Sub.Item>
                        </Menu.Sub.Target>

                        <Menu.Sub.Dropdown>
                            {domains?.map(domain => (
                                <Menu.Item key={domain.id} onClick={() => createDnsRecord(domain.id).catch(handleErrorMessage(t("dnsRecords.CreateDnsRecordError")))}>
                                    {domain.domain}
                                </Menu.Item>
                            ))}
                        </Menu.Sub.Dropdown>
                    </Menu.Sub>

                    <Menu.Sub disabled>
                        <Menu.Sub.Target>
                            <Menu.Sub.Item leftSection={<IconCornerUpRight />}>
                                {t("common.MoveTo")}
                            </Menu.Sub.Item>
                        </Menu.Sub.Target>

                        <Menu.Sub.Dropdown>
                            {domains?.map(domain => (
                                <Menu.Item
                                    key={domain.id}
                                    onClick={() => {
                                        createDnsRecord(domain.id).catch(handleErrorMessage(t("dnsRecords.CreateDnsRecordError")));
                                    }}>
                                    {domain.domain}
                                </Menu.Item>
                            ))}
                        </Menu.Sub.Dropdown>
                    </Menu.Sub>
                </Menu.Dropdown>
            </Menu>
        </Paper>
    );
};

export default DomainDnsRecordCard;