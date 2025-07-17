"use client";

import { ActionIcon, Paper } from "@mantine/core";
import { IconMaximize, IconMinus, IconX } from "@tabler/icons-react";
import { useProfileContext } from "@/utils/contexts/useProfileContext";
import { useEffect, useState } from "react";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";

import ProfileSelector from "../profiles/ProfileSelector";

const Titlebar = () => {
    const [currentWindow, setCurrentWindow] = useState<Window | null>(null);

    const { profile } = useProfileContext();

    useEffect(() => {
        setCurrentWindow(getCurrentWindow());
    }, []);

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
            className="flex justify-between border-t-0 border-r-0 border-l-0 rounded-none">
            <div className="px-1 flex items-center">
                {profile ? (
                    <ProfileSelector />
                ) : null}
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