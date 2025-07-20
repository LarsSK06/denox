"use client";

import ParentProps from "@/types/common/ParentProps";

import { createTheme, MantineProvider } from "@mantine/core";
import { DbContextProvider } from "@/utils/contexts/useDbContext";
import { ProfileContextProvider } from "@/utils/contexts/useProfileContext";
import { Notifications } from "@mantine/notifications";

import "@/utils/i18n";

const theme = createTheme({
    primaryColor: "grape"
});

const Providers = ({ children }: ParentProps) => (
    <MantineProvider theme={theme}>
        <DbContextProvider>
            <ProfileContextProvider>
                <Notifications />
                {children}
            </ProfileContextProvider>
        </DbContextProvider>
    </MantineProvider>
);

export default Providers;