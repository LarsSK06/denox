"use client";

import { ActionIcon, Paper } from "@mantine/core";
import { IconMaximize, IconMinus, IconX } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

import ProfileSelector from "../profiles/ProfileSelector";

const Titlebar = () => {

    const pathname = usePathname();

    return (
        <Paper
            withBorder
            data-tauri-drag-region
            className="flex justify-between border-t-0 border-r-0 border-l-0 rounded-none">
            <div className="px-1 flex items-center">
                {pathname !== "/profiles" ? (
                    <ProfileSelector />
                ) : null}
            </div>

            <div className="p-1 flex gap-1">
                <ActionIcon variant="subtle" color="black">
                    <IconMinus />
                </ActionIcon>

                <ActionIcon variant="subtle" color="black">
                    <IconMaximize />
                </ActionIcon>

                <ActionIcon variant="subtle" color="black">
                    <IconX />
                </ActionIcon>
            </div>
        </Paper>
    );
};

export default Titlebar;