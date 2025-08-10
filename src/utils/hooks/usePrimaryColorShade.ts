import { useMantineTheme } from "@mantine/core";

import usePrimaryShade from "./usePrimaryShade";

const usePrimaryColorShade = () => {
    const mantineTheme = useMantineTheme();
    const shadeIndexer = usePrimaryShade();

    return mantineTheme.colors[mantineTheme.primaryColor][shadeIndexer];
};

export default usePrimaryColorShade;