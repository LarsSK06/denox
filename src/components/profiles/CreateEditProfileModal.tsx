import ProfileGetModel from "@/types/profiles/ProfileGetModel";

import { useDbContext } from "@/utils/contexts/useDbContext";
import { Button, Modal, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconAlertCircle, IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { t } from "i18next";

type CreateEditProfileModalProps = {
    show?: boolean;
    profile: ProfileGetModel | null;
    refresh?: () => any;
    onClose: () => any;
};

const CreateEditProfileModal = ({ show, profile, refresh, onClose }: CreateEditProfileModalProps) => {
    const [localProfile, setLocalProfile] = useState<ProfileGetModel | null>(null);

    const [name, setName] = useState<string>("");
    const [token, setToken] = useState<string>("");
    const [secret, setSecret] = useState<string>("");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { database } = useDbContext();

    useEffect(() => {
        if (profile) setLocalProfile(profile);
        else setTimeout(() => setLocalProfile(null), 300);
    }, [profile]);

    useEffect(() => {
        setName(localProfile?.name ?? "");
        setToken(localProfile?.token ?? "");
        setSecret(localProfile?.secret ?? "");
    }, [localProfile]);

    const handleClose = () => {
        setTimeout(() => {
            setName("");
            setToken("");
            setSecret("");
        }, 300);

        onClose();
    };

    const handleSave = () => {
        setIsLoading(true);

        (
            localProfile
                ? database.execute(
                    `
                    UPDATE profiles
                    SET name = $1, token = $2, secret = $3
                    WHERE id = $4
                    `,
                    [name, token, secret, localProfile.id]
                )
                : database.execute(
                    `
                    INSERT INTO profiles (name, token, secret)
                    VALUES ($1, $2, $3)
                    `,
                    [name, token, secret]
                )
        ).then(() => {
            handleClose();
            refresh?.();
        }).catch(error => notifications.show({
            title:
                localProfile
                    ? t("profiles.EditProfileError")
                    : t("profiles.CreateProfileError"),
            message: `${error}`,
            color: "red",
            position: "top-center",
            icon: <IconAlertCircle />
        })).finally(() => setIsLoading(false));
    };

    return (
        <Modal
            centered
            opened={!!show}
            onClose={handleClose}
            title={
                localProfile
                    ? t("other.EditItem", { item: localProfile.name })
                    : t("profiles.CreateProfile")
            }>
            <form className="flex flex-col gap-2">
                <TextInput label={t("common.Name")} value={name} onChange={event => setName(event.currentTarget.value)} />
                <TextInput label={t("common.Token")} value={token} onChange={event => setToken(event.currentTarget.value)} />
                <TextInput label={t("common.Secret")} value={secret} onChange={event => setSecret(event.currentTarget.value)} />
            </form>

            <div className="mt-4 flex justify-end gap-2">
                <Button leftSection={<IconChevronLeft />} onClick={() => handleClose()} loading={isLoading} variant="subtle">
                    {t("common.Cancel")}
                </Button>

                <Button leftSection={<IconDeviceFloppy />} onClick={() => handleSave()} loading={isLoading}>
                    {t("common.Save")}
                </Button>
            </div>
        </Modal>
    );
};

export default CreateEditProfileModal;