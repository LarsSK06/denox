import DomainGetModel from "@/types/domains/DomainGetModel";

import { List, ListItem, Paper, Text } from "@mantine/core";
import { t } from "i18next";

type DomainNameserversListProps = {
    domain: DomainGetModel;
};

const DomainNameserversList = ({ domain }: DomainNameserversListProps) => (
    <Paper withBorder shadow="sm" component="figure" className="p-2 flex flex-col gap-2">
        <Text component="figcaption" size="lg">
            {t("common.Nameservers")}
        </Text>

        <List className="ml-2">
            {domain.nameservers.map(ns => (
                <ListItem key={ns} className="list-decimal">
                    <span className="italic">
                        {ns}
                    </span>
                </ListItem>
            ))}
        </List>
    </Paper>
);

export default DomainNameserversList;