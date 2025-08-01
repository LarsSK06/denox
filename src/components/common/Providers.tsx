"use client";

import ParentProps from "@/types/common/ParentProps";

import { createTheme, MantineProvider } from "@mantine/core";
import { SettingsContextProvider } from "@/utils/contexts/useSettingsContext";
import { PositionContextProvider } from "@/utils/contexts/usePositionContext";
import { ProfileContextProvider } from "@/utils/contexts/useProfileContext";
import { DbContextProvider } from "@/utils/contexts/useDbContext";
import { Notifications } from "@mantine/notifications";

import "@/utils/i18n";

const theme = createTheme({
    primaryColor: "grape"
});

const Providers = ({ children }: ParentProps) => (
    <MantineProvider theme={theme}>
        <DbContextProvider>
            <SettingsContextProvider>
                <ProfileContextProvider>
                    <PositionContextProvider>
                        <Notifications />
                        {children}
                    </PositionContextProvider>
                </ProfileContextProvider>
            </SettingsContextProvider>
        </DbContextProvider>
    </MantineProvider>
);

export default Providers;