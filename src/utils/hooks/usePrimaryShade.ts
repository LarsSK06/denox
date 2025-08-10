import { useMantineTheme } from "@mantine/core";

import useColorScheme from "./useColorScheme";

const usePrimaryShade = () => {
    const mantineTheme = useMantineTheme();

    const { isDark: isColorSchemeDark } = useColorScheme();

    return (
        typeof mantineTheme.primaryShade === "object"
            ? mantineTheme.primaryShade[isColorSchemeDark ? "dark" : "light"]
            : mantineTheme.primaryShade
    );
};

export default usePrimaryShade;