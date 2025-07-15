import { useProfileContext } from "@/utils/contexts/useProfileContext";
import { Button, Popover, Skeleton, Text } from "@mantine/core";
import { IconArrowRight, IconUser } from "@tabler/icons-react";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { t } from "i18next";

import useDbSelect from "@/utils/hooks/useDbSelect";
import ProfileGetModel from "@/types/profiles/ProfileGetModel";
import getArrayFromNumber from "@/utils/functions/getArrayFromNumber";

const ProfileSelector = () => {

    const { profile, setProfile } = useProfileContext();

    const {
        isLoading: isProfilesLoading,
        data: profiles,
        call: getProfiles
    } = useDbSelect<ProfileGetModel[]>({ query: "SELECT * FROM profiles" });

    useEffect(() => {
        getProfiles();

        const onFocus = () => {
            getProfiles();
        };

        window.addEventListener("focus", onFocus);

        return () => window.removeEventListener("focus", onFocus);
    }, []);

    return (profiles?.length === 0 || !profile) ? redirect("/profiles") : (
        <Popover closeOnClickOutside>
            <Popover.Target>
                <Button
                    leftSection={<IconUser />}
                    size="compact-md"
                    variant="light"
                    color="dsorange">
                    {profile?.name ?? "..."}
                </Button>
            </Popover.Target>

            <Popover.Dropdown>
                <figure>
                    <Text size="sm">
                        {t("profiles.Profiles")}
                    </Text>

                    <ul aria-live="assertive" aria-busy={isProfilesLoading}>
                        {isProfilesLoading ? (
                            getArrayFromNumber(5).map(i => (
                                <Skeleton component="li" />
                            ))
                        ) : (
                            profiles?.map(profile => (
                                <Button rightSection={<IconArrowRight />}>
                                    {profile.name}
                                </Button>
                            ))
                        )}
                    </ul>
                </figure>
            </Popover.Dropdown>
        </Popover>
    );
};

export default ProfileSelector;