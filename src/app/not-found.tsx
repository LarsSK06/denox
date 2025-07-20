"use client";

import IllustrationNotFound from "@/components/illustrations/IllustrationNotFound";

import { IconChevronLeft } from "@tabler/icons-react";
import { Button, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { t } from "i18next";

const Page = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const router = useRouter();

    const onClick = () => {
        setIsLoading(true);

        router.back();
    };
    
    return (
        <main className="w-full h-full flex justify-center items-center">
            <div className="flex flex-col items-center gap-2">
                <IllustrationNotFound scale={.5} aria-hidden />

                <Text component="h1" size="lg" className="font-bold">
                    {t("genericErrors.404NotFound")}
                </Text>

                <Button variant="subtle" leftSection={<IconChevronLeft />} onClick={onClick} loading={isLoading}>
                    {t("common.GoBack")}
                </Button>
            </div>
        </main>
    );
}

export default Page;