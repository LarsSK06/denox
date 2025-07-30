"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import useSearchParamId from "@/utils/hooks/useSearchParamId";
import Link from "next/link";
import useMount from "@/utils/hooks/useMount";

import { NavLink, Transition } from "@mantine/core";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { IconChevronRight } from "@tabler/icons-react";

type DomainNavButtonProps = {
    domain: DomainGetModel;
    index?: number;
};

const DomainNavButton = ({ domain, index = 0 }: DomainNavButtonProps) => {
    const isMounted = useMount();

    const domainId = useSearchParamId({ key: "domainId", type: "number" });
    const isActive = `${domainId}` === `${domain.id}`;

    const { allowAnimations, capitalizeDomainNames } = useSettingsContext();

    return (
        <Transition mounted={isMounted} enterDelay={allowAnimations ? index * 100 : 0} transition="fade-right" duration={allowAnimations ? undefined : 0}>
            {style => (
                <NavLink
                    key={domain.id}
                    active={isActive}
                    variant="filled"
                    href={`/domains?domainId=${domain.id}`}
                    label={capitalizeDomainNames ? domain.domain.toUpperCase() : domain.domain.toLowerCase()}
                    component={Link}
                    rightSection={
                        <Transition mounted={isActive} transition="fade-right" duration={allowAnimations ? undefined : 0}>
                            {iconStyle => (
                                <IconChevronRight style={iconStyle} />
                            )}
                        </Transition>
                    }
                    style={style}
                />
            )}
        </Transition>
    );
};

export default DomainNavButton;