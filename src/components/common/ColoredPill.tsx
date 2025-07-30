import useColorScheme from "@/utils/hooks/useColorScheme";

import { MantineTheme, Pill, useMantineTheme } from "@mantine/core";
import { ComponentProps, useMemo } from "react";

type ColoredPillProps = {
    color: keyof MantineTheme["colors"];
} & ComponentProps<typeof Pill>;

const ColoredPill = ({ color, ...restProps }: ColoredPillProps) => {
    const { isDark: isColorSchemeDark } = useColorScheme();

    const mantineTheme = useMantineTheme();

    const [backgroundColor, borderColor] = useMemo(() => {
        const mantineColorTuple = mantineTheme.colors[color];

        return [mantineColorTuple[isColorSchemeDark ? 9 : 2], mantineColorTuple[isColorSchemeDark ? 2 : 9]] as [string, string];
    }, [color]);

    return (
        <Pill
            styles={{
                root: {
                    backgroundColor,
                    borderColor,
                    borderWidth: "1px",
                    color: borderColor
                }
            }}
            {...restProps}
        />
    );
};

export default ColoredPill;