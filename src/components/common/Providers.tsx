"use client";

import ParentProps from "@/types/common/ParentProps";

import { createTheme, MantineProvider } from "@mantine/core";
import { DbContextProvider } from "@/utils/contexts/useDbContext";
import { ProfileContextProvider } from "@/utils/contexts/useProfileContext";

import "@/utils/i18n";

const theme = createTheme({
    primaryColor: "dsblue",
    colors: {
        dsorange: [
            "#fff3e1",
            "#ffe7cc",
            "#fdcd9d",
            "#fab269",
            "#f79a3d",
            "#f68b20",
            "#f68410",
            "#db7102",
            "#c46300",
            "#ab5400"
        ],
        dsblue: [
            "#e4f8ff",
            "#d3ebfc",
            "#a9d4f1",
            "#7cbce8",
            "#57a8df",
            "#3e9bdb",
            "#3498db",
            "#1d81c2",
            "#0973af",
            "#00639c"
        ]
    }
});

const Providers = ({ children }: ParentProps) => (
    <MantineProvider theme={theme}>
        <DbContextProvider>
            <ProfileContextProvider>
                {children}
            </ProfileContextProvider>
        </DbContextProvider>
    </MantineProvider>
);

export default Providers;