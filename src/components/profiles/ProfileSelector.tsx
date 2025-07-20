import { useProfileContext } from "@/utils/contexts/useProfileContext";
import { Button, Popover } from "@mantine/core";
import { IconUser, IconUsers } from "@tabler/icons-react";
import { t } from "i18next";

const ProfileSelector = () => {

    const { profile, setProfile } = useProfileContext();

    return (
        <Popover closeOnClickOutside position="bottom-start">
            <Popover.Target>
                <Button
                    leftSection={<IconUser />}
                    size="compact-md"
                    variant="light">
                    {profile?.name ?? "..."}
                </Button>
            </Popover.Target>

            <Popover.Dropdown>
                <Button leftSection={<IconUsers />} onClick={() => setProfile(null!)}>
                    {t("profiles.ManageProfiles")}
                </Button>
            </Popover.Dropdown>
        </Popover>
    );
};

export default ProfileSelector;