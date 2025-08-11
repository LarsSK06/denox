import TagGetModel from "@/types/tags/TagGetModel";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";

import { useDbContext } from "@/utils/contexts/useDbContext";
import { useTagsContext } from "@/utils/contexts/useTagsContext";
import { Button, getThemeColor, MantineColor, Modal, Radio, TextInput, useMantineTheme } from "@mantine/core";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { t } from "i18next";
import { useEffect, useState } from "react";

type CreateEditTagModalProps = {
    show: boolean;
    onClose: () => unknown;
    tag: (TagGetModel & { domainsCount?: number; }) | null;
};

const CreateEditTagModal = ({ show, onClose, tag }: CreateEditTagModalProps) => {
    const [name, setName] = useState<string>(tag?.name ?? "");
    const [color, setColor] = useState<MantineColor>(tag?.color ?? "indigo");

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        if (show) {
            setName(tag?.name ?? "");
            setColor(tag?.color ?? "indigo");
        }
        else {
            setTimeout(() => {
                setName("");
                setColor("indigo");
            }, 300);
        }
    }, [show]);

    const mantineTheme = useMantineTheme();

    const { setTags } = useTagsContext();
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
                .then(() => onClose())
                .catch(error => {
                    setTags(prev =>
                        prev!.map(t =>
                            t.id === tag.id
                                ? { ...tag, domainsCount: tag.domainsCount ?? 0 }
                                : t
                        )
                    );

                    handleErrorMessage(error)(t("tags.EditTagError"));
                })
                .finally(() => setIsLoading(false));
        }
        else {
            const syntheticId = Date.now();

            setTags(prev => [
                ...prev!,
                {
                    id: syntheticId,
                    name,
                    color,
                    domainsCount: 0
                }
            ]);

            db.execute("INSERT INTO tags (name, color) VALUES ($1, $2)", [name, color])
                .then(() => onClose())
                .catch(error => {
                    setTags(prev => prev!.filter(t => t.id !== syntheticId));

                    handleErrorMessage(error)(t("tags.CreateTagError"));
                })
                .finally(() => setIsLoading(false));
        }
    };

    return (
        <Modal opened={show} onClose={onClose} title={tag ? t("tags.EditTag") : t("tags.CreateTag")}>
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
                    <Button leftSection={<IconChevronLeft />} variant="subtle" onClick={() => onClose()} loading={isLoading}>
                        {t("common.Cancel")}
                    </Button>

                    <Button leftSection={<IconDeviceFloppy />} type="submit" loading={isLoading}>
                        {t("common.Save")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateEditTagModal;