import DnsRecordGetModel from "@/types/dnsRecords/DnsRecordGetModel";

import { ActionIcon, Checkbox, Menu, Paper, Table } from "@mantine/core";
import { IconDots, IconPencil, IconTrash } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";
import { t } from "i18next";

type DomainDnsRecordCardProps = {
    dnsRecord: DnsRecordGetModel;
    isQuickEditMode: boolean;
    selectedDnsRecordIds: number[];
    setSelectedDnsRecordIds: Dispatch<SetStateAction<number[]>>;
    setDnsRecordToEdit: Dispatch<SetStateAction<DnsRecordGetModel | null>>;
};

const DomainDnsRecordCard = ({
    dnsRecord,
    isQuickEditMode,
    selectedDnsRecordIds,
    setSelectedDnsRecordIds,
    setDnsRecordToEdit
}: DomainDnsRecordCardProps) => {
    return (
        <Paper withBorder shadow="sm" component="li" className="flex p-2 gap-4">
            <div className="flex items-center">
                <Checkbox
                    checked={selectedDnsRecordIds.includes(dnsRecord.id)}
                    onChange={event => {
                        if (event.currentTarget.checked)
                            setSelectedDnsRecordIds([...selectedDnsRecordIds, dnsRecord.id]);
                        else setSelectedDnsRecordIds(selectedDnsRecordIds.filter(id => id !== dnsRecord.id));
                    }}
                />
            </div>

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

            <div className="flex items-center">
                {isQuickEditMode ? (
                    <div className="flex flex-col">
                        <ActionIcon variant="subtle" onClick={() => setDnsRecordToEdit(dnsRecord)}>
                            <IconPencil />
                        </ActionIcon>

                        <ActionIcon variant="subtle" color="red">
                            <IconTrash />
                        </ActionIcon>
                    </div>
                ) : (
                    <Menu>
                        <Menu.Target>
                            <ActionIcon variant="subtle" aria-label={t("common.Actions")}>
                                <IconDots />
                            </ActionIcon>
                        </Menu.Target>
                    </Menu>
                )}
            </div>
        </Paper>
    );
};

export default DomainDnsRecordCard;