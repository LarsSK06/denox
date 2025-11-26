import Note_GET from "@/types/notes/Note_GET";
import handleErrorMessage from "../functions/handleErrorMessage";

import { useState } from "react";
import { useDbContext } from "../contexts/useDbContext";
import { t } from "i18next";

type UseNotesRepository = {
    domain: string;
};

const useNotesRepository = ({ domain }: UseNotesRepository) => {
    const { database: db } = useDbContext();


    const [isNotesLoading, setIsNotesLoading] = useState<boolean>(false);
    const [notes, setNotes] = useState<Note_GET[] | null>(null);

    const getNotes = () => new Promise<Note_GET[]>((resolve, reject) => {
        setIsNotesLoading(true);

        db.select<Note_GET[]>("SELECT * FROM notes WHERE domain = $1", [domain])
            .then(value => {
                setNotes(value);
                resolve(value);
            })
            .catch(reject)
            .finally(() => setIsNotesLoading(false));
    });


    const [isCreateNoteLoading, setIsCreateNoteLoading] = useState<boolean>(false);

    const createNote = (text: string) => new Promise<boolean>(resolve => {
        setIsCreateNoteLoading(true);

        const syntheticId = Date.now() + .1;

        setNotes(prev => [
            ...prev!,
            {
                id: syntheticId,
                domain,
                text
            }
        ]);

        db.execute("INSERT INTO notes (domain, text) VALUES ($1, $2)", [domain, text])
            .then(({ lastInsertId: createdNoteId }) => {
                setNotes(prev => prev!.map(n =>
                    n.id === syntheticId ? {
                        ...n,
                        id: createdNoteId!
                    } : n
                ));

                resolve(true);
            })
            .catch(error => {
                setNotes(prev => prev!.filter(n => n.id !== syntheticId));

                handleErrorMessage(t("notes.CreateNoteError"))(error);

                resolve(false);
            })
            .finally(() => setIsCreateNoteLoading(false));
    });


    const [isDeleteNotesLoading, setIsDeleteNotesLoading] = useState<boolean>(false);

    const deleteNotes = (noteIds: number[]) => new Promise<boolean>(resolve => {
        setIsDeleteNotesLoading(true);

        const deletedNotes = structuredClone(notes?.filter(n => noteIds.includes(n.id)) ?? []);

        setNotes(prev => prev!.filter(n => !noteIds.includes(n.id)));

        db.execute("DELETE FROM notes WHERE id IN (SELECT value FROM json_each($1))", [JSON.stringify(noteIds)])
            .then(() => resolve(true))
            .catch(error => {
                handleErrorMessage(t("notes.DeleteNotesError"))(error);

                setNotes(prev => [...prev!, ...deletedNotes]);

                resolve(false);
            })
            .finally(() => setIsDeleteNotesLoading(false));
    });


    return {
        isNotesLoading,
        notes,
        getNotes,

        isCreateNoteLoading,
        createNote,

        isDeleteNotesLoading,
        deleteNotes
    };
};

export default useNotesRepository;