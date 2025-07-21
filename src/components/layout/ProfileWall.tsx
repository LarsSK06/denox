"use client";

import ParentProps from "@/types/common/ParentProps";
import ProfileGetModel from "@/types/profiles/ProfileGetModel";
import useDbSelect from "@/utils/hooks/useDbSelect";
import TableBodySkeleton from "../common/TableBodySkeleton";
import CreateEditProfileModal from "../profiles/CreateEditProfileModal";
import IllustrationChill from "../illustrations/IllustrationChill";

import { useProfileContext } from "@/utils/contexts/useProfileContext";
import { useEffect, useState } from "react";
import { ActionIcon, Button, Menu, Paper, Radio, Table, Text } from "@mantine/core";
import { IconAlertCircle, IconChevronRight, IconDots, IconPencil, IconPlus, IconTrash } from "@tabler/icons-react";
import { useDbContext } from "@/utils/contexts/useDbContext";
import { notifications } from "@mantine/notifications";
import { t } from "i18next";
import Link from "next/link";

const ProfileWall = ({ children }: ParentProps) => {
    const [showCreateProfileModal, setShowCreateProfileModal] = useState<boolean>(false);
    const [profileToEdit, setProfileToEdit] = useState<ProfileGetModel | null>(null);

    const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

    const { profile: currentProfile, setProfile: setCurrentProfile } = useProfileContext();
    const { database } = useDbContext();

    const {
        isLoading: isProfilesLoading,
        data: profiles,
        setData: setProfiles,
        call: getProfiles
    } = useDbSelect<ProfileGetModel[]>({ query: "SELECT * FROM profiles" });

    useEffect(() => {
        getProfiles();
    }, []);

    useEffect(() => {
        if (profiles) setSelectedProfileId(profiles.find(p => p.id === selectedProfileId)?.id ?? null);
        else setSelectedProfileId(null);
    }, [profiles]);

    useEffect(() => {
        window.localStorage.setItem("lastProfileId", `${currentProfile?.id}`);
    }, [currentProfile]);

    const isList =
        !isProfilesLoading &&
        profiles &&
        profiles.length > 0;

    const handleDeleteProfile = (profileId: number) => {
        setProfiles(profiles!.filter(p => p.id !== profileId));

        database.execute("DELETE FROM profiles WHERE id = $1", [profileId])
            .catch(error => notifications.show({
                title: t("profiles.DeleteProfileError"),
                message: `${error}`,
                color: "red",
                position: "top-center",
                icon: <IconAlertCircle />
            }))
            .finally(() => getProfiles());
    };

    return currentProfile ? children : (
        <>
            <CreateEditProfileModal
                show={showCreateProfileModal || !!profileToEdit}
                profile={profileToEdit}
                refresh={() => getProfiles()}
                onClose={() => {
                    setShowCreateProfileModal(false);
                    setProfileToEdit(null);
                }}
            />

            <div className="w-full h-full flex justify-center items-center">
                <Paper withBorder shadow="xs" component="form" className="w-96 p-4 flex flex-col items-start gap-2">
                    <Text size="xl">
                        {t("profiles.SelectProfile")}
                    </Text>

                    {isList || isProfilesLoading ? (
                        <Table>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Td className="w-0">
                                        <Radio
                                            size="xs"
                                            checked={!selectedProfileId}
                                            onChange={event => {
                                                if (event.currentTarget.checked) setSelectedProfileId(null);
                                            }}
                                        />
                                    </Table.Td>

                                    <Table.Td className="font-bold">
                                        {t("common.Name")}
                                    </Table.Td>

                                    <Table.Td className="w-0">
                                        <span className="sr-only">
                                            {t("common.Actions")}
                                        </span>
                                    </Table.Td>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                {isProfilesLoading ? (
                                    <TableBodySkeleton rows={5} columns={3} />
                                ) : (
                                    profiles?.map(profile => (
                                        <Table.Tr className="transition-all" key={profile.id} style={{ backdropFilter: selectedProfileId === profile.id ? "brightness(90%)" : undefined }}>
                                            <Table.Td>
                                                <Radio
                                                    size="xs"
                                                    checked={selectedProfileId === profile.id}
                                                    onChange={event => {
                                                        if (event.currentTarget.checked) setSelectedProfileId(profile.id)
                                                    }}
                                                />
                                            </Table.Td>

                                            <Table.Td>
                                                {profile.name}
                                            </Table.Td>

                                            <Table.Td className="flex">
                                                <Menu>
                                                    <Menu.Target>
                                                        <ActionIcon variant="subtle" size="sm">
                                                            <IconDots />
                                                        </ActionIcon>
                                                    </Menu.Target>

                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            leftSection={<IconPencil />}
                                                            onClick={() => setProfileToEdit(profile)}>
                                                            {t("profiles.EditProfile")}
                                                        </Menu.Item>

                                                        <Menu.Item
                                                            leftSection={<IconTrash />}
                                                            color="red"
                                                            onClick={() => handleDeleteProfile(profile.id)}>
                                                            {t("profiles.DeleteProfile")}
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))
                                )}
                            </Table.Tbody>
                        </Table>
                    ) : (
                        <div className="mx-auto">
                            <IllustrationChill scale={.25} />
                        </div>
                    )}

                    <Button fullWidth leftSection={<IconPlus />} onClick={() => setShowCreateProfileModal(true)}>
                        {t("profiles.CreateProfile")}
                    </Button>

                    <Button
                        component={Link}
                        href="/"
                        onClick={() => setCurrentProfile(profiles!.find(p => p.id === selectedProfileId)!)}
                        disabled={!selectedProfileId}
                        className="ml-auto transition-colors"
                        rightSection={<IconChevronRight />}>
                        {t("common.Continue")}
                    </Button>
                </Paper>
            </div>
        </>
    );
};

export default ProfileWall;