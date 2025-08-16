import ParentProps from "@/types/common/ParentProps";
import ProfileGetModel from "@/types/profiles/ProfileGetModel";

import { createContext, createElement, Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { invalidContextUsageError, lastProfileIdCacheKey } from "../globals";
import { useDbContext } from "./useDbContext";

type ProfileContextValue = {
    isReady: boolean;

    profile: ProfileGetModel;
    setProfile: Dispatch<SetStateAction<ProfileGetModel>>;
};

const ProfileContext = createContext<ProfileContextValue | undefined>(undefined);

export const ProfileContextProvider = ({ children }: ParentProps) => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [profile, setProfile] = useState<ProfileGetModel>(null!);

    const { database } = useDbContext();

    useEffect(() => {
        const rawProfileId = window.localStorage.getItem(lastProfileIdCacheKey);

        if (!rawProfileId) return setIsReady(true);

        const profileId = Number(rawProfileId);

        if (Number.isNaN(profileId)) return setIsReady(true);

        database.select<ProfileGetModel[]>("SELECT * FROM profiles WHERE id = $1", [profileId])
            .then(relevantProfiles => {
                if (relevantProfiles.length > 0)
                    setProfile(relevantProfiles[0]);
            })
            .catch(() => {})
            .finally(() => setIsReady(true));
    }, []);

    const value = useMemo<ProfileContextValue>(() => ({ isReady, profile, setProfile }), [isReady, profile]);

    return createElement(ProfileContext.Provider, { value }, children);
};

export const useProfileContext = () => {
    const context = useContext(ProfileContext);

    if (!context) throw new Error(invalidContextUsageError);

    return context;
};