import NoteGetModel from "@/types/notes/NoteGetModel";
import handleErrorMessage from "@/utils/functions/handleErrorMessage";

import { useDbContext } from "@/utils/contexts/useDbContext";
import { Button, Modal, Textarea } from "@mantine/core";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { t } from "i18next";

type CreateNoteModalProps = {
    show: boolean;
    onClose: () => unknown;
    domain: string;
    setNotes: Dispatch<SetStateAction<NoteGetModel[] | null>>;
};

const CreateNoteModal = ({ show, onClose, domain, setNotes }: CreateNoteModalProps) => {
    const [text, setText] = useState<string>("");

    const { database: db } = useDbContext();

    useEffect(() => {
        if (show) return;

        setTimeout(() => {
            setText("");
        }, 300);
    }, [show]);

    const onFormSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();

        const syntheticId = Date.now();

        setNotes(prev => [
            ...prev!,
            {
                id: syntheticId,
                domain,
                text
            }
        ]);

        db.execute("INSERT INTO notes (domain, text) VALUES ($1, $2)", [domain, text])
            .catch(error => {
                setNotes(prev => prev!.filter(n => n.id !== syntheticId));

                handleErrorMessage(t("notes.CreateNoteError"))(error);
            });

        onClose();
    };

    return (
        <Modal
            opened={show}
            onClose={onClose}
            title={t("notes.CreateNote")}>
            <form onSubmit={onFormSubmit} className="flex flex-col gap-2">
                <Textarea
                    label={t("common.Text")}
                    value={text}
                    onChange={event => setText(event.currentTarget.value)}
                />

                <div className="mt-4 flex justify-end gap-2">
                    <Button leftSection={<IconChevronLeft />} variant="subtle" onClick={() => onClose()}>
                        {t("common.Cancel")}
                    </Button>

                    <Button type="submit" leftSection={<IconDeviceFloppy />}>
                        {t("common.Save")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default CreateNoteModal;