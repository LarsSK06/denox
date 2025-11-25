"use client";

import IllustrationError from "@/components/illustrations/IllustrationError";
import ErrorPageProps from "@/types/common/ErrorPageProps";

import { Anchor, Text } from "@mantine/core";
import { t } from "i18next";

const Page = ({ error, reset }: ErrorPageProps) => (
    <main className="w-full h-full flex justify-center items-center">
        <div className="flex items-center flex-col">
            <IllustrationError scale={.75} />

            <Text size="xl">
                {t("genericErrors.404NotFound")}
            </Text>

            <Text size="xl">
                {error.message}
            </Text>

            <Anchor size="xl" component="button" onClick={() => reset()}>
                {t("common.Reset")}
            </Anchor>
        </div>
    </main>
);

export default Page;