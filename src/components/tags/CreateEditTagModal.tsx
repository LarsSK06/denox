import TagGetModel from "@/types/tags/TagGetModel";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";

import { useDbContext } from "@/utils/contexts/useDbContext";
import { Button, getThemeColor, MantineColor, Modal, Radio, TextInput, useMantineTheme } from "@mantine/core";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { t } from "i18next";

type CreateEditTagModalProps = {
    show: boolean;
    onClose: () => unknown;
    tag: (TagGetModel & { domainsCount?: number; invoicesCount?: number; }) | null;
    setTags: Dispatch<SetStateAction<(TagGetModel & { domainsCount: number; invoicesCount: number; })[] | null>>
};

const CreateEditTagModal = ({ show, onClose, tag, setTags }: CreateEditTagModalProps) => {
    const [isEditMode, setIsEditMode] = useState<boolean>(false);

    const [name, setName] = useState<string>(tag?.name ?? "");
    const [color, setColor] = useState<MantineColor>(tag?.color ?? "indigo");

    const setValues = () => {
        setIsEditMode(!!tag);

        setName(tag?.name ?? "");
        setColor(tag?.color ?? "indigo");
    };

    useEffect(() => {
        if (show) setValues();
        else setTimeout(setValues, 300);
    }, [show]);

    useEffect(() => {
        if (tag) setValues();
        else setTimeout(setValues, 300);
    }, [tag]);

    const mantineTheme = useMantineTheme();

    const { database: db } = useDbContext();

    const onFormSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();

        if (tag) {
            setTags(prev =>
                prev!.map(t =>
                    t.id === tag.id ? {
                        ...t,
                        name,
                        color
                    } : t
                )
            );

            db.execute("UPDATE tags SET name = $1, color = $2 WHERE id = $3", [name, color, tag.id])
                .catch(error => {
                    setTags(prev =>
                        prev!.map(t =>
                            t.id === tag.id
                                ? {
                                    ...tag,
                                    domainsCount: tag.domainsCount ?? 0,
                                    invoicesCount: tag.invoicesCount ?? 0
                                }
                                : t
                        )
                    );

                    handleErrorMessage(error)(t("tags.EditTagError"));
                });
        }
        else {
            const syntheticId = Date.now() + .1;

            setTags(prev => [
                ...prev!,
                {
                    id: syntheticId,
                    name,
                    color,
                    domainsCount: 0,
                    invoicesCount: 0
                }
            ]);

            db.execute("INSERT INTO tags (name, color) VALUES ($1, $2)", [name, color])
                .then(({ lastInsertId: createdTagId }) => {
                    setTags(prev => prev!.map(t =>
                        t.id === syntheticId ? {
                            ...t,
                            id: createdTagId!
                        } : t
                    ));
                })
                .catch(error => {
                    setTags(prev => prev!.filter(t => t.id !== syntheticId));

                    handleErrorMessage(error)(t("tags.CreateTagError"));
                });
        }

        onClose();
    };

    return (
        <Modal opened={show} onClose={onClose} title={isEditMode ? t("tags.EditTag") : t("tags.CreateTag")}>
            <form className="flex flex-col gap-2" onSubmit={onFormSubmit}>
                <TextInput
                    required
                    autoFocus
                    label={t("common.Name")}
                    value={name}
                    onChange={event => setName(event.currentTarget.value)}
                />

                <Radio.Group
                    required
                    label={t("common.Color")}
                    value={color}
                    onChange={value => setColor(value)}>
                    {Object.keys(mantineTheme.colors)
                        .filter(c => typeof c === "string")
                        .map(c => (
                        <Radio.Card value={c} key={c} className="flex p-1">
                            <Radio.Indicator checked={color === c} />

                            <svg style={{ width: "1rem", marginLeft: ".5rem" }} viewBox="0 0 10 10">
                                <circle
                                    cx={5}
                                    cy={5}
                                    r="5"
                                    fill={getThemeColor(c, mantineTheme)}
                                />
                            </svg>
                        </Radio.Card>
                    ))}
                </Radio.Group>

                <div className="mt-4 flex justify-end gap-2">
                    <Button leftSection={<IconChevronLeft />} variant="subtle" onClick={() => onClose()}>
                        {t("common.Cancel")}
                    </Button>

                    <Button leftSection={<IconDeviceFloppy />} type="submit">
                        {t("common.Save")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateEditTagModal;