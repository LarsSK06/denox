"use client";

import { ActionIcon, Menu, Paper } from "@mantine/core";
import { IconDots, IconShieldLock } from "@tabler/icons-react";
import { t } from "i18next";

import Link from "next/link";

const Footer = () => {
    return (
        <Paper
            withBorder
            className="border-r-0 border-b-0 border-l-0 rounded-none">
            <nav className="p-1 flex gap-2">
                <Menu>
                    <Menu.Target>
                        <ActionIcon variant="subtle">
                            <IconDots />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item component={Link} href="/do-not-sell-my-data" leftSection={<IconShieldLock />}>
                            {t("other.DoNotSellMyData")}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            </nav>
        </Paper>
    );
};

export default Footer;