import { getThemeColor, useMantineTheme } from "@mantine/core";
import { TailChase } from "ldrs/react";

import "ldrs/react/TailChase.css";

type LoaderProps = {
    size?: number;
};

const Loader = ({ size = 60 }: LoaderProps) => {

    const mantineTheme = useMantineTheme();

    return (
        <TailChase
            size={size}
            color={getThemeColor(mantineTheme.primaryColor, mantineTheme)}
        />
    );
};

export default Loader;