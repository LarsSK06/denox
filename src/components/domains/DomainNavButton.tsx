"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import Link from "next/link";
import useMount from "@/utils/hooks/useMount";

import { Button, Transition } from "@mantine/core";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";

type DomainNavButtonProps = {
    domain: DomainGetModel;
    index?: number;
};

const DomainNavButton = ({ domain, index = 0 }: DomainNavButtonProps) => {
    const isMounted = useMount();

    const domainId = useSearchParamId({ key: "domainId", type: "number" });

    const { capitalizeDomainNames } = useSettingsContext();

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
                        {capitalizeDomainNames ? domain.domain.toUpperCase() : domain.domain.toLowerCase()}
                    </Button>
                </li>
            )}
        </Transition>
    );
};

export default DomainNavButton;