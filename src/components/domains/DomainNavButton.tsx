"use client";

import DomainGetModel from "@/types/domains/DomainGetModel";
import useMount from "@/utils/hooks/useMount";

import { NavLink, Transition } from "@mantine/core";
import { useSettingsContext } from "@/utils/contexts/useSettingsContext";
import { IconChevronRight } from "@tabler/icons-react";
import { usePositionContext } from "@/utils/contexts/usePositionContext";

type DomainNavButtonProps = {
    domain: DomainGetModel;
    index?: number;
};

const DomainNavButton = ({ domain, index = 0 }: DomainNavButtonProps) => {
    const isMounted = useMount();
    
    const { allowAnimations, capitalizeDomainNames } = useSettingsContext();
    const { domainId, setDomainId } = usePositionContext();

    const isActive = domainId === domain.id;

    return (
        <Transition mounted={isMounted} enterDelay={allowAnimations ? index * 100 : 0} transition="fade-right" duration={allowAnimations ? undefined : 0}>
            {style => (
                <NavLink
                    key={domain.id}
                    active={isActive}
                    variant="filled"
                    label={capitalizeDomainNames ? domain.domain.toUpperCase() : domain.domain.toLowerCase()}
                    rightSection={
                        <Transition mounted={isActive} transition="fade-right" duration={allowAnimations ? undefined : 0}>
                            {iconStyle => (
                                <IconChevronRight style={iconStyle} />
                            )}
                        </Transition>
                    }
                    onClick={() => setDomainId(domain.id)}
                    style={style}
                />
            )}
        </Transition>
    );
};

export default DomainNavButton;