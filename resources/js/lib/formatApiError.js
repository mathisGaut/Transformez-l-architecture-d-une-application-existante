/** Affiche les erreurs de validation Laravel (422) ou un message générique. */
export function formatValidationMessage(data) {
    if (!data?.errors) {
        return data?.message ?? 'Une erreur est survenue.';
    }
    const parts = [];
    for (const [field, msgs] of Object.entries(data.errors)) {
        parts.push(`${field}: ${Array.isArray(msgs) ? msgs[0] : msgs}`);
    }
    return parts.join(' ');
}
