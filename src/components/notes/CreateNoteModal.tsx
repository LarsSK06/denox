import useNotesRepository from "@/utils/repositories/notesRepository";

import { Button, Modal, Textarea } from "@mantine/core";
import { IconChevronLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { t } from "i18next";

type CreateNoteModalProps = {
    show: boolean;
    onClose: () => unknown;
    notesRepository: ReturnType<typeof useNotesRepository>;
};

const CreateNoteModal = ({ show, onClose, notesRepository }: CreateNoteModalProps) => {
    const [text, setText] = useState<string>("");

    useEffect(() => {
        if (show) return;

        setTimeout(() => {
            setText("");
        }, 300);
    }, [show]);

    const onFormSubmit = (event?: React.FormEvent) => {
        event?.preventDefault();

        notesRepository.createNote(text)

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