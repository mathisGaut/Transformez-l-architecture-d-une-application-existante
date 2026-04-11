<?php

namespace App\Contracts;

use App\Models\Note;
use App\Models\User;
use Illuminate\Support\Collection;

interface NoteServiceInterface
{
    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Note>
     */
    public function listForUser(User $user): Collection;

    public function createForUser(User $user, string $text, int $tagId): Note;

    public function deleteForUser(User $user, int $noteId): void;
}
