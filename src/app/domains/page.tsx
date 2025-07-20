"use client";

import IllustrationIcons from "@/components/illustrations/IllustrationIcons";
import DomainGetModel from "@/types/domains/DomainGetModel";
import Endpoint from "@/types/http/Endpoint";
import useHttpClient from "@/utils/hooks/useHttpClient";
import useSearchParamId from "@/utils/hooks/useSearchParamId";

import { ActionIcon, Paper, Transition } from "@mantine/core";
import { IconCross, IconX } from "@tabler/icons-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
    const domainId = useSearchParamId({ key: "domainId", type: "number" });
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const {
        isLoading: isDomainLoading,
        data: domain,
        call: getDomain
    } = useHttpClient<DomainGetModel>({
        endpoint: [Endpoint.Domains, domainId]
    });

    useEffect(() => {
        if (!domainId) return;

        getDomain();
    }, [domainId]);

    return (
        <div className="w-full h-full relative">
            <Transition mounted={!!domainId}>
                {style => (
                    <Paper withBorder className="p-1 flex absolute top-4 right-4" style={style}>
                        <ActionIcon variant="transparent" onClick={() => {
                            const before = new URLSearchParams(searchParams);

                            before.delete("domainId");
                            router.push(`${pathname}?${before}`);
                        }}>
                            <IconX />
                        </ActionIcon>
                    </Paper>
                )}
            </Transition>

            {domainId ? (
                <></>
            ) : (
                <div className="w-full h-full flex justify-center items-center">
                   <IllustrationIcons scale={.5} />
                </div>
            )}
        </div>
    );
};

export default Page;