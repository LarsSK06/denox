"use client";

import { ActionIcon, Menu, Paper, Skeleton, Text } from "@mantine/core";
import { IconDots, IconInfoCircle, IconSettings, IconShieldLock } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { t } from "i18next";

import Link from "next/link";

import * as app from "@tauri-apps/api/app";

const Footer = () => {

    const [version, setVersion] = useState<string | null>(null);

    useEffect(() => {
        app.getVersion().then(setVersion);
    }, []);

    return (
        <Paper
            withBorder
            component="footer"
            className="border-r-0 border-b-0 border-l-0 rounded-none">
            <nav className="p-1 flex justify-between">
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

                        <Menu.Item component={Link} href="/technical-info" leftSection={<IconInfoCircle />}>
                            {t("common.TechnicalInfo")}
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>

                <ActionIcon variant="subtle" component={Link} href="/settings">
                    <IconSettings />
                </ActionIcon>
            </nav>
        </Paper>
    );
};

export default Footer;