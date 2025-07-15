import ParentProps from "@/types/common/ParentProps";
import ProfileGetModel from "@/types/profiles/ProfileGetModel";

import { createContext, createElement, Dispatch, SetStateAction, useContext, useMemo, useState } from "react";
import { invalidContextUsageError } from "../globals";

type ProfileContextValue = {
    profile: ProfileGetModel | null;
    setProfile: Dispatch<SetStateAction<ProfileGetModel | null>>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileContextProvider = ({ children }: ParentProps) => {
    const [profile, setProfile] = useState<ProfileGetModel | null>(null);

    const value = useMemo<ProfileContextValue>(() => ({ profile, setProfile }), [profile]);

    return createElement(ProfileContext.Provider, { value }, children);
};

export const useProfileContext = () => {
    const context = useContext(ProfileContext);

    if (!context) throw new Error(invalidContextUsageError);

    return context;
};