import ProfileGetModel from "@/types/profiles/ProfileGetModel";

import { useDbContext } from "@/utils/contexts/useDbContext";
import { Button, Checkbox, Collapse, Modal, PasswordInput, TextInput } from "@mantine/core";
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
    const [isPasswordProtected, setIsPasswordProtected] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");

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
        setIsPasswordProtected(localProfile?.isPasswordProtected ?? false);
        setPassword("");
    }, [localProfile]);

    const handleClose = () => {
        setTimeout(() => {
            setName("");
            setToken("");
            setSecret("");
            setIsPasswordProtected(false);
            setPassword("");
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
                    SET name = $1, isPasswordProtected = $2, token = $3, secret = $4, editedAt = $5
                    WHERE id = $6
                    `,
                    [name, isPasswordProtected, token, secret, Date.now(), localProfile.id]
                )
                : database.execute(
                    `
                    INSERT INTO profiles (name, isPasswordProtected, token, secret, createdAt)
                    VALUES ($1, $2, $3, $4, $5)
                    `,
                    [name, isPasswordProtected, token, secret, Date.now()]
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
            <form className="flex flex-col items-start gap-4">
                <TextInput
                    required
                    className="w-full"
                    label={t("common.Name")}
                    value={name}
                    onChange={event => setName(event.currentTarget.value)}
                />

                <TextInput
                    required
                    className="w-full"
                    label={t("common.Token")}
                    value={token}
                    onChange={event => setToken(event.currentTarget.value)}
                />

                <PasswordInput
                    required
                    className="w-full"
                    label={t("common.Secret")}
                    value={secret}
                    onChange={event => setSecret(event.currentTarget.value)}
                />

                <Checkbox
                    label={t("common.PasswordProtected")}
                    checked={isPasswordProtected}
                    onChange={event => setIsPasswordProtected(event.currentTarget.checked)}
                    disabled={!!localProfile}
                />

                <Collapse className="w-full" in={isPasswordProtected && !localProfile}>
                    <PasswordInput
                        required
                        className="w-full"
                        label={t("common.Password")}
                        value={password}
                        onChange={event => setPassword(event.currentTarget.value)}
                    />
                </Collapse>
            </form>

            <div className="mt-4 flex justify-end gap-2">
                <Button leftSection={<IconChevronLeft />} onClick={() => handleClose()} loading={isLoading} variant="subtle">
                    {t("common.Cancel")}
                </Button>

                <Button
                    className="transition-colors"
                    leftSection={<IconDeviceFloppy />}
                    onClick={() => handleSave()}
                    loading={isLoading}
                    disabled={
                        !name ||
                        !token ||
                        !secret ||
                        (isPasswordProtected && !password)
                    }>
                    {t("common.Save")}
                </Button>
            </div>
        </Modal>
    );
};

export default CreateEditProfileModal;