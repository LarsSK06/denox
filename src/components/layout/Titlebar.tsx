"use client";

import { ActionIcon, Button, Divider, Paper, Tabs, Tooltip } from "@mantine/core";
import { IconAntenna, IconFileDollar, IconMaximize, IconMinus, IconUsers, IconX } from "@tabler/icons-react";
import { useProfileContext } from "@/utils/contexts/useProfileContext";
import { useEffect, useState } from "react";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";
import { t } from "i18next";

import ProfileSelector from "../profiles/ProfileSelector";
import Logo from "../common/Logo";
import useDbSelect from "@/utils/hooks/useDbSelect";
import ProfileGetModel from "@/types/profiles/ProfileGetModel";
import Link from "next/link";

const Titlebar = () => {
    const [currentWindow, setCurrentWindow] = useState<Window | null>(null);

    const { profile, setProfile } = useProfileContext();

    const handleMinimize = () => currentWindow?.minimize();

    const handleMaximize = async () => {
        if (await currentWindow?.isMaximized())
            await currentWindow?.unmaximize();
        else await currentWindow?.maximize();
    };

    const handleClose = () => currentWindow?.close();

    return (
        <Paper
            withBorder
            data-tauri-drag-region
            component="header"
            className="flex justify-between border-t-0 border-r-0 border-l-0 rounded-none"
            aria-label={t("common.Titlebar")}>
            <div className="px-1 flex items-center gap-2">
                <Logo width={28} height={28} aria-hidden />

                {profile ? (
                    <Tooltip label={t("profiles.Profiles")}>
                        <ActionIcon onClick={() => setProfile(null!)}>
                            <IconUsers />
                        </ActionIcon>
                    </Tooltip>
                ) : null}

                <Divider orientation="vertical" />

                <nav className="h-full flex items-center gap-2">
                    <Button variant="light" component={Link} href="/domains" leftSection={<IconAntenna />} size="compact-md">
                        {t("domains.Domains")}
                    </Button>

                    <Button variant="light" component={Link} href="/invoices" leftSection={<IconFileDollar />} size="compact-md">
                        {t("invoices.Invoices")}
                    </Button>
                </nav>
            </div>

            <div className="p-1 flex gap-1">
                <ActionIcon variant="subtle" color="black" onClick={() => handleMinimize()}>
                    <IconMinus />
                </ActionIcon>

                <ActionIcon variant="subtle" color="black" onClick={() => handleMaximize()}>
                    <IconMaximize />
                </ActionIcon>

                <ActionIcon variant="subtle" color="black" onClick={() => handleClose()}>
                    <IconX />
                </ActionIcon>
            </div>
        </Paper>
    );
};

export default Titlebar;