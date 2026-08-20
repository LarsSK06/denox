import { MantineColor, useMantineTheme } from "@mantine/core";
import { useMemo } from "react";

import useColorScheme from "@/utils/hooks/useConciseColorScheme";

function useColorPair(color: MantineColor) {

    const { isDark: isColorSchemeDark } = useColorScheme();

    const mantineTheme = useMantineTheme();

    return useMemo(() => {
        const mantineColorTuple = mantineTheme.colors[color];

        return (
            isColorSchemeDark ? [
                "transparent",
                mantineColorTuple[4]
            ] : [
                mantineColorTuple[1],
                mantineColorTuple[9]
            ]
        ) satisfies [string, string];
    }, [color, isColorSchemeDark]);
}

export default useColorPair;