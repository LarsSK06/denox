import { useMantineTheme } from "@mantine/core";

import useColorScheme from "./useColorScheme";

const usePrimaryColorShade = () => {
    const { primaryColor, primaryShade, colors } = useMantineTheme();
    const { isDark: isColorSchemeDark } = useColorScheme();

    const shadeIndexer =
        typeof primaryShade === "object"
            ? primaryShade[isColorSchemeDark ? "dark" : "light"]
            : primaryShade;

    return colors[primaryColor][shadeIndexer];
};

export default usePrimaryColorShade;