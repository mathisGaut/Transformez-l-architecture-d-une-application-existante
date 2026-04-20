import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import api from '../lib/api.js';
import { formatValidationMessage } from '../lib/formatApiError.js';

export default function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');
    const [text, setText] = useState('');
    const [tagId, setTagId] = useState('');
    const [formError, setFormError] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const fetchAll = useCallback(async () => {
        setLoadError('');
        try {
            const [notesRes, tagsRes] = await Promise.all([api.get('/notes'), api.get('/tags')]);
            setNotes(Array.isArray(notesRes.data) ? notesRes.data : []);
            setTags(Array.isArray(tagsRes.data) ? tagsRes.data : []);
            setTagId((prev) => {
                if (prev) {
                    return prev;
                }
                const list = tagsRes.data;
                if (Array.isArray(list) && list.length > 0) {
                    return String(list[0].id);
                }
                return '';
            });
        } catch (err) {
            setLoadError(err.response?.data?.message ?? 'Impossible de charger les données.');
            setNotes([]);
            setTags([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAll();
    }, [fetchAll]);

    async function handleCreate(e) {
        e.preventDefault();
        setFormError('');
        if (!tagId) {
            setFormError('Choisissez un tag ou créez-en un sur la page Tags.');
            return;
        }
        setActionLoading(true);
        try {
            const { data } = await api.post('/notes', {
                text,
                tag_id: Number(tagId),
            });
            setNotes((prev) => [data, ...prev]);
            setText('');
        } catch (err) {
            setFormError(formatValidationMessage(err.response?.data));
        } finally {
            setActionLoading(false);
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Supprimer cette note ?')) {
            return;
        }
        setActionLoading(true);
        try {
            await api.delete(`/notes/${id}`);
            setNotes((prev) => prev.filter((n) => n.id !== id));
        } catch (err) {
            setFormError(formatValidationMessage(err.response?.data));
        } finally {
            setActionLoading(false);
        }
    }

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
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
                    Données issues de <code className="rounded bg-zinc-100 px-1 py-0.5 text-xs dark:bg-zinc-800">GET /api/notes</code>.
                </p>
            </div>

            {loadError ? (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
                    {loadError}
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
