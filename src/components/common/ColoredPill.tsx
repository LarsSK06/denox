import useColorPair from "@/utils/hooks/useColorPair";

import { MantineColor, Pill } from "@mantine/core";
import { ComponentProps } from "react";

type ColoredPillProps = {
    color: MantineColor;
} & ComponentProps<typeof Pill>;

const ColoredPill = ({ color, ...restProps }: ColoredPillProps) => {

    const [bgColor, fgColor] = useColorPair(color);

    return (
        <Pill
            {...restProps}
            styles={{
                ...restProps.styles,
                root: {
                    bgColor,
                    borderColor: fgColor,
                    borderWidth: "1px",
                    color: fgColor
                },
                label: {
                    transform: "translateY(-1px)"
                }
            }}
        />
    );
};

export default ColoredPill;