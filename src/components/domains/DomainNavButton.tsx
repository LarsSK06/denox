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

    const { allowAnimations, capitalizeDomainNames } = useSettingsContext();

    return (
        <Transition mounted={isMounted} enterDelay={allowAnimations ? index * 100 : 0} transition="fade-right" duration={allowAnimations ? undefined : 0}>
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