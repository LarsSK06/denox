"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import Link from "next/link";

import { Button, Transition } from "@mantine/core";
import { useEffect, useState } from "react";

type DomainNavButtonProps = {
    domain: DomainGetModel;
    index?: number;
};

const DomainNavButton = ({ domain, index = 0 }: DomainNavButtonProps) => {
    const [isMounted, setIsMounted] = useState<boolean>(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const domainId = useSearchParamId({ key: "domainId", type: "number" });

    return (
        <Transition mounted={isMounted} enterDelay={index * 100} transition="fade-right">
            {style => (
                <li style={style}>
                    <Button
                        fullWidth
                        component={Link}
                        variant={`${domainId}` === `${domain.id}` ? "light" : "subtle"}
                        styles={{ inner: { justifyContent: "start" } }}
                        href={`/domains?domainId=${domain.id}`}
                        className="rounded-none">
                        {domain.domain}
                    </Button>
                </li>
            )}
        </Transition>
    );
};

export default DomainNavButton;