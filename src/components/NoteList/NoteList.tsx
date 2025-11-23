import css from "./NoteList.module.css";
import type { Note } from "../../types/note.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";

interface NoteListProps {
  notes: Note[];
}

const NoteList = ({ notes }: NoteListProps) => {
  const queryClient = useQueryClient();
  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteNote(id);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myNoteHubKey"] });
    },
  });

  const handleDeleteNote = (id: string) => {
    mutationDelete.mutate(id);
  };
  return (
    <ul className={css.list}>
      {notes.map((el) => (
        <li className={css.listItem} key={el.id}>
          <h2 className={css.title}>{el.title}</h2>
          <p className={css.content}>{el.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{el.tag}</span>
            <button
              className={css.button}
              onClick={() => handleDeleteNote(el.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};
export default NoteList;
