import { useMantineColorScheme } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

const useColorScheme = () => {
    const [isBrowserColorSchemeDark, setIsBrowserColorSchemeDark] = useState<boolean>(false);

    const { colorScheme } = useMantineColorScheme();

    useEffect(() => {
        const handleSetAccordingColorScheme = () => setIsBrowserColorSchemeDark(window.matchMedia("(prefers-color-scheme: dark)").matches);

        handleSetAccordingColorScheme();

        window.addEventListener("change", handleSetAccordingColorScheme);

        return () => window.removeEventListener("change", handleSetAccordingColorScheme);
    }, []);

    const isColorSchemeDark = useMemo(() => (
        (colorScheme === "auto" && isBrowserColorSchemeDark) ||
        colorScheme === "dark"
    ), [isBrowserColorSchemeDark, colorScheme]);

    return {
        isDark: isColorSchemeDark,
        isLight: !isColorSchemeDark
    };
};

export default useColorScheme;