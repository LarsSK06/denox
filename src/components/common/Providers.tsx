"use client";

import ParentProps from "@/types/common/ParentProps";

import { createTheme, MantineProvider } from "@mantine/core";
import { SettingsContextProvider } from "@/utils/contexts/useSettingsContext";
import { ProfileContextProvider } from "@/utils/contexts/useProfileContext";
import { DbContextProvider } from "@/utils/contexts/useDbContext";
import { Notifications } from "@mantine/notifications";

import "@/utils/i18n";

const theme = createTheme({
    primaryColor: "grape",
    defaultRadius: 0
});

const Providers = ({ children }: ParentProps) => (
    <MantineProvider theme={theme} defaultColorScheme="dark">
        <DbContextProvider>
            <SettingsContextProvider>
                <ProfileContextProvider>
                    <Notifications />
                    {children}
                </ProfileContextProvider>
            </SettingsContextProvider>
        </DbContextProvider>
    </MantineProvider>
);

export default Providers;