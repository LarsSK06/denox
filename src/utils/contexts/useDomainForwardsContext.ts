import ForwardGetModel from "@/types/forwards/ForwardGetModel";
import useHttpClient from "../hooks/useHttpClient";
import Endpoint from "@/types/http/Endpoint";

import { createContext, createElement, Dispatch, SetStateAction, useContext, useMemo } from "react";
import { usePositionContext } from "./usePositionContext";
import ParentProps from "@/types/common/ParentProps";
import { invalidContextUsageError } from "../globals";

type DomainForwardsContextValue = {
    isForwardsLoading: boolean;
    forwards: ForwardGetModel[] | null;
    setForwards: Dispatch<SetStateAction<ForwardGetModel[] | null>>;
    getForwards: ReturnType<typeof useHttpClient<ForwardGetModel[]>>["call"];
};

const DomainForwardsContext = createContext<DomainForwardsContextValue | undefined>(undefined);

export const DomainForwardsContextProvider = ({ children }: ParentProps) => {
    const { domainId } = usePositionContext();

    const {
        isLoading: isForwardsLoading,
        data: forwards,
        setData: setForwards,
        call: getForwards
    } = useHttpClient<ForwardGetModel[]>({
        endpoint: [Endpoint.Domains, domainId, Endpoint.Forwards]
    });

    const value = useMemo<DomainForwardsContextValue>(() => ({
        isForwardsLoading,
        forwards,
        setForwards,
        getForwards
    }), [isForwardsLoading, forwards]);

    return createElement(DomainForwardsContext, { value }, children);
};

export const useDomainForwardsContext = () => {
    const context = useContext(DomainForwardsContext);

    if (!context) throw new Error(invalidContextUsageError);

    return context;
};