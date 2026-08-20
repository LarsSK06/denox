"use client";

import ParentProps from "@/types/common/ParentProps";

import { createTheme, MantineProvider } from "@mantine/core";
import { SettingsContextProvider } from "@/utils/contexts/useSettingsContext";
import { ProfileContextProvider } from "@/utils/contexts/useProfileContext";
import { DbContextProvider } from "@/utils/contexts/useDbContext";
import { Notifications } from "@mantine/notifications";
import { Inter_Tight } from "next/font/google";

import "@/utils/i18n";

const fontFamily = Inter_Tight({ subsets: ["latin"] });

const theme = createTheme({
    primaryColor: "grape",
    fontFamily: fontFamily.style.fontFamily,
    defaultRadius: "xs"
});

const Providers = ({ children }: ParentProps) => (
    <MantineProvider theme={theme}>
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