import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";

import { ActionIcon, Checkbox, Menu, Paper, Table } from "@mantine/core";
import { IconDots, IconTrash } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";
import { t } from "i18next";

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
    return (
        <Paper withBorder shadow="sm" component="li" className="flex items-center p-2 gap-4">
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
                    <Menu.Item leftSection={<IconTrash />} color="red">
                        {t("dnsRecords.DeleteDnsRecord")}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
        </Paper>
    );
};

export default DomainDnsRecordCard;