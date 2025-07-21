import DomainStatus from "@/types/domains/DomainStatus";
import translateDomainStatus from "@/utils/functions/translateDomainStatus";

import { Paper, Text, useMantineTheme } from "@mantine/core";
import { t } from "i18next";
import { useMemo } from "react";

type DomainStatusChipProps = {
    status: DomainStatus;
};

const DomainStatusChip = ({ status }: DomainStatusChipProps) => {
    const mantineTheme = useMantineTheme();

    const [backgroundColor, borderColor] = useMemo(() => {
        let mantineColorTuple;

        switch (status) {
            case DomainStatus.Active:
                mantineColorTuple = mantineTheme.colors.green;
                break;

            case DomainStatus.Expired:
                mantineColorTuple = mantineTheme.colors.blue;
                break;

            case DomainStatus.Deactivated:
                mantineColorTuple = mantineTheme.colors.red;
                break;

            case DomainStatus.PendingDeleteRestorable:
                mantineColorTuple = mantineTheme.colors.yellow;
                break;    
        }

        return [mantineColorTuple[2], mantineColorTuple[9]] as [string, string];
    }, [status]);

    return (
        <Paper withBorder styles={{ root: { borderColor, backgroundColor } }} className="w-fit px-4 py-1 rounded-full">
            <table>
                <tbody>
                    <tr>
                        <th>
                            <span className="sr-only">
                                {t("common.Status")}
                            </span>
                        </th>

                        <td>
                            <Text style={{ color: borderColor }}>
                                {translateDomainStatus(status)}
                            </Text>
                        </td>
                    </tr>
                </tbody>
            </table>
        </Paper>
    );
};

export default DomainStatusChip;