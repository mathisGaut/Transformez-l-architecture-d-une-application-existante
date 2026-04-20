import { useEffect, useState } from 'react';

import { clearTagCreateError, createTag, fetchTags } from '../features/tags/tagsSlice.js';
import { formatValidationMessage } from '../lib/formatApiError.js';
import { useAppDispatch, useAppSelector } from '../store/hooks.js';

export default function TagsPage() {
    const dispatch = useAppDispatch();
    const tags = useAppSelector((s) => s.tags.items);
    const listStatus = useAppSelector((s) => s.tags.listStatus);
    const listError = useAppSelector((s) => s.tags.listError);
    const createError = useAppSelector((s) => s.tags.createError);
    const createStatus = useAppSelector((s) => s.tags.createStatus);

    const [name, setName] = useState('');

    useEffect(() => {
        dispatch(fetchTags());
    }, [dispatch]);

    async function handleSubmit(e) {
        e.preventDefault();
        dispatch(clearTagCreateError());
        try {
            await dispatch(createTag(name)).unwrap();
            setName('');
        } catch {
            // erreur dans le store
        }
    }

    const loading = listStatus === 'loading';
    const submitting = createStatus === 'loading';
    const formError = createError ? formatValidationMessage(createError) : '';

    if (loading) {
        return (
            <div className="text-sm text-zinc-600 dark:text-zinc-400" role="status">
                Chargement des tags…
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">Tags</h1>
            </div>

            {listError ? (
                <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
                    {listError}
                </p>
            ) : null}

            <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Nouveau tag</h2>
                <form className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end" onSubmit={handleSubmit}>
                    <div className="min-w-0 flex-1">
                        <label htmlFor="tag-name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Nom (max. 50 caractères, unique)
                        </label>
                        <input
                            id="tag-name"
                            name="name"
                            type="text"
                            required
                            maxLength={50}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-900 shadow-sm outline-none ring-zinc-400 focus:ring-2 dark:border-zinc-600 dark:bg-zinc-950 dark:text-zinc-100"
                            placeholder="ex. Idées, Urgent…"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || !name.trim()}
                        className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
                    >
                        {submitting ? 'Création…' : 'Créer'}
                    </button>
                </form>
                {formError ? (
                    <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200" role="alert">
                        {formError}
                    </p>
                ) : null}
            </section>

            <section>
                <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    Liste ({tags.length})
                </h2>
                {tags.length === 0 ? (
                    <p className="mt-3 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/40 dark:text-zinc-400">
                        Aucun tag. Ajoutez-en un ci-dessus.
                    </p>
                ) : (
                    <ul className="mt-4 flex flex-wrap gap-2">
                        {tags.map((tag) => (
                            <li
                                key={tag.id}
                                className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-200"
                            >
                                <span className="font-medium">{tag.name}</span>
                                <span className="ms-2 text-xs text-zinc-500 dark:text-zinc-400">#{tag.id}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
