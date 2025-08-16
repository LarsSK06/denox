"use client";

import IllustrationNotFound from "@/components/illustrations/IllustrationNotFound";

import { Anchor, Text } from "@mantine/core";
import { t } from "i18next";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const router = useRouter();

    const onBackButtonClick = () => {
        setIsLoading(true);

        router.back();
    };

    return (
        <main className="w-full h-full flex justify-center items-center">
            <div className="flex items-center flex-col">
                <IllustrationNotFound scale={.75} />

                <Text size="xl">
                    {t("genericErrors.404NotFound")}
                </Text>

                <Anchor size="xl" component="button" disabled={isLoading} onClick={onBackButtonClick}>
                    {t("common.GoBack")}
                </Anchor>
            </div>
        </main>
    );
}

export default Page;