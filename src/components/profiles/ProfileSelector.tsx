import { useProfileContext } from "@/utils/contexts/useProfileContext";
import { ActionIcon, Button, Popover, Skeleton, Text } from "@mantine/core";
import { IconArrowRight, IconRefresh, IconUser } from "@tabler/icons-react";
import { useEffect } from "react";
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
    }, []);

    return (
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
                    <div className="flex justify-between items-center gap-2">
                        <Text component="figcaption" size="sm">
                            {t("profiles.Profiles")}
                        </Text>
                        
                        <ActionIcon variant="subtle" size="sm">
                            <IconRefresh />
                        </ActionIcon>
                    </div>

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