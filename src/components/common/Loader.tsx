import { getThemeColor, useMantineTheme } from "@mantine/core";
import { JellyTriangle } from "ldrs/react";

import "ldrs/react/JellyTriangle.css";

type LoaderProps = {
    size?: number;
};

const Loader = ({ size = 60 }: LoaderProps) => {

    const mantineTheme = useMantineTheme();

    return (
        <JellyTriangle
            size={size}
            color={getThemeColor(mantineTheme.primaryColor, mantineTheme)}
        />
    );
};

export default Loader;