import React from "react";
import { useEffect, useState } from "react";
import fetchNotes from "../../services/noteService";
import css from "./App.module.css";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import Notelist from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import Modal from "../Modal/Modal";
import SearchBox from "../SearchBox/SearchBox";
import Loader from "../Loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import ErrorMessage from "../ErrorMassage/ErrorMessage";
import NoteForm from "../NoteForm/NoteForm";
import { useDebouncedCallback } from "use-debounce";

export default function App() {
  const [searchWord, setSearchWord] = useState<string>("");
  const [page, setPage] = useState(1);
  const [openModal, setOpenModal] = useState(false);

  const handleChange = useDebouncedCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchWord(event.target.value);
      setPage(1);
    },
    1000
  );

  const { data, isFetching, isError } = useQuery({
    queryKey: ["myNoteHubKey", searchWord, page],
    queryFn: () => fetchNotes(searchWord, page),
    placeholderData: keepPreviousData,
  });
  useEffect(() => {
    if (data?.notes.length === 0) {
      toast.error("There is nothing on request.");
    }
  }, [data]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <div className={css.app}>
      <header className={css.toolbar}>
        {<SearchBox value={searchWord} onChange={handleChange} />}
        {data && data?.notes.length > 0 && (
          <Pagination
            totalPages={data?.totalPages ?? 0}
            page={page}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}

        {
          <button className={css.button} onClick={handleOpenModal}>
            CreateNote +
          </button>
        }
      </header>
      <Toaster />
      {isFetching && <Loader />}
      {isError && <ErrorMessage />}
      {data && data?.notes.length > 0 && <Notelist notes={data?.notes} />}
      {openModal && (
        <Modal onClose={handleCloseModal}>
          <NoteForm onClose={handleCloseModal} />
        </Modal>
      )}
    </div>
  );
}
