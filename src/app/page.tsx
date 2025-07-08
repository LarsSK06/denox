"use client";

import { Button } from "@mantine/core";
import { t } from "i18next";

const Page = () => {
    return (
        <Button>
            {t("common.HelloWorld")}
        </Button>
    );
};

export default Page;