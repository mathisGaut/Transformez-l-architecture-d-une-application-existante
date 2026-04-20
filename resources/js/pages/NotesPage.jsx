import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { createNote, deleteNote, fetchNotes } from '../features/notes/notesSlice.js';
import { fetchTags } from '../features/tags/tagsSlice.js';
import { formatValidationMessage } from '../lib/formatApiError.js';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';

export default function NotesPage() {
    const dispatch = useAppDispatch();
    const notes = useAppSelector((s) => s.notes.items);
    const tags = useAppSelector((s) => s.tags.items);
    const listStatus = useAppSelector((s) => s.notes.listStatus);
    const tagsListStatus = useAppSelector((s) => s.tags.listStatus);
    const listError = useAppSelector((s) => s.notes.listError);
    const tagsListError = useAppSelector((s) => s.tags.listError);
    const createError = useAppSelector((s) => s.notes.createError);
    const deleteError = useAppSelector((s) => s.notes.deleteError);
    const createStatus = useAppSelector((s) => s.notes.createStatus);
    const deleteStatus = useAppSelector((s) => s.notes.deleteStatus);

    const [text, setText] = useState('');
    const [tagId, setTagId] = useState('');

    useEffect(() => {
        dispatch(fetchNotes());
        dispatch(fetchTags());
    }, [dispatch]);

    useEffect(() => {
        if (!tagId && tags.length > 0) {
            setTagId(String(tags[0].id));
        }
    }, [tags, tagId]);

    async function handleCreate(e) {
        e.preventDefault();
        if (!tagId) {
            return;
        }
        try {
            await dispatch(
                createNote({
                    text,
                    tag_id: Number(tagId),
                }),
            ).unwrap();
            setText('');
        } catch {
            // erreur dans le store
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Supprimer cette note ?')) {
            return;
        }
        try {
            await dispatch(deleteNote(id)).unwrap();
        } catch {
            // erreur dans le store
        }
    }

    const loading = listStatus === 'loading' || tagsListStatus === 'loading';
    const actionLoading = createStatus === 'loading' || deleteStatus === 'loading';
    const loadError = listError || tagsListError;
    const formError = createError ? formatValidationMessage(createError) : '';
    const mutationMsg = deleteError ? formatValidationMessage(deleteError) : '';

    if (loading) {
        return (
            <div className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
                Chargement des notes…
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Notes</h1>
            </div>

            {loadError ? (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
                    {loadError}
                </p>
            ) : null}

            {mutationMsg ? (
                <p className="rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200" role="alert">
                    {mutationMsg}
                </p>
            ) : null}

            <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Nouvelle note</h2>
                {tags.length === 0 ? (
                    <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
                        Aucun tag disponible.{' '}
                        <Link to="/tags" className="font-medium text-zinc-900 underline dark:text-zinc-100">
                            Créer un tag
                        </Link>{' '}
                        d’abord.
                    </p>
                ) : (
                    <form className="mt-4 space-y-4" onSubmit={handleCreate}>
                        <div>
                            <label htmlFor="note-text" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Texte
                            </label>
                            <textarea
                                id="note-text"
                                name="text"
                                required
                                rows={4}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                                placeholder="Contenu de la note…"
                            />
                        </div>
                        <div>
                            <label htmlFor="note-tag" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                                Tag
                            </label>
                            <select
                                id="note-tag"
                                name="tag_id"
                                required
                                value={tagId}
                                onChange={(e) => setTagId(e.target.value)}
                                className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                            >
                                {tags.map((t) => (
                                    <option key={t.id} value={t.id}>
                                        {t.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {formError ? (
                            <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
                                {formError}
                            </p>
                        ) : null}
                        <button
                            type="submit"
                            disabled={actionLoading}
                            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                        >
                            {actionLoading ? 'Envoi…' : 'Ajouter la note'}
                        </button>
                    </form>
                )}
            </section>

            <section>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Liste ({notes.length})
                </h2>
                {notes.length === 0 ? (
                    <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
                        Aucune note pour le moment.
                    </p>
                ) : (
                    <ul className="mt-4 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
                        {notes.map((note) => (
                            <li key={note.id} className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:justify-between">
                                <div className="min-w-0 flex-1">
                                    <p className="whitespace-pre-wrap text-sm text-zinc-900 dark:text-zinc-100">{note.text}</p>
                                    <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                                        Tag :{' '}
                                        <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                                            {note.tag?.name ?? `#${note.tag_id}`}
                                        </span>
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(note.id)}
                                    disabled={actionLoading}
                                    className="shrink-0 rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 disabled:opacity-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40"
                                >
                                    Supprimer
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
