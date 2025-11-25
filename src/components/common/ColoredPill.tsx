import useColorScheme from "@/utils/hooks/useConciseColorScheme";

import { MantineColor, Pill, useMantineTheme } from "@mantine/core";
import { ComponentProps, useMemo } from "react";

type ColoredPillProps = {
    color: MantineColor;
} & ComponentProps<typeof Pill>;

const ColoredPill = ({ color, ...restProps }: ColoredPillProps) => {
    const { isDark: isColorSchemeDark } = useColorScheme();

    const mantineTheme = useMantineTheme();

    const [backgroundColor, foregroundColor] = useMemo(() => {
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

    return (
        <Pill
            {...restProps}
            styles={{
                ...restProps.styles,
                root: {
                    backgroundColor,
                    borderColor: foregroundColor,
                    borderWidth: "1px",
                    color: foregroundColor,
                    borderRadius: 0
                },
                label: {
                    transform: "translateY(-1px)"
                }
            }}
        />
    );
};

export default ColoredPill;