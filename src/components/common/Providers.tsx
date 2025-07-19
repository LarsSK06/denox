"use client";

import ParentProps from "@/types/common/ParentProps";
import ProfileWall from "../layout/ProfileWall";

import { createTheme, MantineProvider } from "@mantine/core";
import { DbContextProvider } from "@/utils/contexts/useDbContext";
import { ProfileContextProvider } from "@/utils/contexts/useProfileContext";
import { Notifications } from "@mantine/notifications";

import "@/utils/i18n";

const theme = createTheme({
    primaryColor: "indigo"
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