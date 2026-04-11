<?php

namespace App\Services;

use App\Contracts\NoteServiceInterface;
use App\Models\Note;
use App\Models\User;
use Illuminate\Support\Collection;

class NoteService implements NoteServiceInterface
{
    public function listForUser(User $user): Collection
    {
        return Note::query()
            ->with('tag')
            ->where('user_id', $user->id)
            ->latest()
            ->get();
    }

    public function createForUser(User $user, string $text, int $tagId): Note
    {
        return Note::create([
            'user_id' => $user->id,
            'tag_id' => $tagId,
            'text' => $text,
        ]);
    }

    public function deleteForUser(User $user, int $noteId): void
    {
        $note = Note::query()
            ->where('user_id', $user->id)
            ->whereKey($noteId)
            ->firstOrFail();

        $note->delete();
    }
}
