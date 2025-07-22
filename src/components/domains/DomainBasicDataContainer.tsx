import DomainGetModel from "@/types/domains/DomainGetModel";
import Check from "../common/Check";
import DomainWebHotelSize from "@/types/domains/DomainWebHotelSize";

import { Paper, Skeleton, Text } from "@mantine/core";
import { t } from "i18next";

type DomainBasicDataContainerProps = {
    isDomainLoading: boolean;
    domain: DomainGetModel | null;
};

const DomainBasicDataContainer = ({ isDomainLoading, domain }: DomainBasicDataContainerProps) => {

    return !isDomainLoading && domain ? (
        <>
            <div className="flex justify-between gap-2" aria-hidden>
                {([
                    [t("common.DNS"), domain.services.dns],
                    [t("common.Email"), domain.services.email],
                    [t("common.Registrar"), domain.services.registrar]
                ] satisfies [string, boolean][]).map(([label, enabled]) => (
                    <Paper withBorder className="p-2 px-4 flex flex-col items-center gap-2" key={label}>
                        <Check mode={enabled ? "true" : "false"} />

                        <Text>
                            {label}
                        </Text>
                    </Paper>
                ))}
            </div>

            <Paper withBorder shadow="sm" className="p-2">
                <table className="w-full">
                    <tbody>
                        <tr>
                            <Text component="th" className="text-start">
                                {t("common.Registrant")}:
                            </Text>

                            <Text fs="italic" component="td" className="text-end">
                                {domain.registrant}
                            </Text>
                        </tr>

                        <tr className="sr-only">
                            <th>
                                {t("common.Registrar")}:
                            </th>

                            <td>
                                <Check mode={domain.services.registrar ? "true" : "false"} className="ml-auto" />
                            </td>
                        </tr>

                        <tr className="sr-only">
                            <th>
                                {t("common.DNS")}:
                            </th>

                            <td>
                                {domain.services.dns ? t("common.Yes") : t("common.No")}
                            </td>
                        </tr>

                        <tr className="sr-only">
                            <th>
                                {t("common.Email")}:
                            </th>

                            <td>
                                {domain.services.email ? t("common.Yes") : t("common.No")}
                            </td>
                        </tr>

                        <tr className="sr-only">
                            <th>
                                {t("common.Webhotel")}:
                            </th>

                            <td>
                                {domain.services.webhotel !== DomainWebHotelSize.None ? t("common.Yes") : t("common.No")}
                            </td>
                        </tr>

                        <tr>
                            <Text component="th" className="text-start align-text-top">
                                {t("common.Nameservers")}

                                <Text component="span" c="gray">
                                    {` ..${domain.nameservers.length}`}
                                </Text>
                                :
                            </Text>

                            <td>
                                <ol className="w-fit ml-auto">
                                    {domain.nameservers.map(ns => (
                                        <Text fs="italic" component="li" key={ns}>
                                            {ns}
                                        </Text>
                                    ))}
                                </ol>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Paper>
        </>
    ) : (
        <Skeleton height={216.38} />
    );
};

export default DomainBasicDataContainer;