import ParentProps from "@/types/common/ParentProps";

import { createContext, createElement, Dispatch, SetStateAction, useContext, useMemo, useState } from "react";
import { invalidContextUsageError } from "../globals";

type PositionContextValue = {
    domainId: number | null;
    setDomainId: Dispatch<SetStateAction<number | null>>;

    domainTab: "overview" | "dns";
    setDomainTab: Dispatch<SetStateAction<"overview" | "dns">>;
};

const PositionContext = createContext<PositionContextValue | undefined>(undefined);

export const PositionContextProvider = ({ children }: ParentProps) => {
    const [domainId, setDomainId] = useState<number | null>(null);
    const [domainTab, setDomainTab] = useState<"overview" | "dns">("overview");

    const value = useMemo(() => ({
        domainId,
        setDomainId,

        domainTab,
        setDomainTab
    }), [domainId, domainTab]);

    return createElement(PositionContext.Provider, { value }, children);
};

export const usePositionContext = () => {
    const context = useContext(PositionContext);

    if (!context) throw new Error(invalidContextUsageError);

    return context;
};