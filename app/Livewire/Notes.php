<?php

namespace App\Livewire;

use App\Contracts\NoteServiceInterface;
use App\Contracts\TagServiceInterface;
use Illuminate\Support\Facades\Auth;
use Livewire\Component;

class Notes extends Component
{
    public $notes;

    public $text = '';

    public $tag_id = '';

    public $tags;

    protected NoteServiceInterface $noteService;

    protected TagServiceInterface $tagService;

    protected $rules = [
        'text' => 'required|string',
        'tag_id' => 'required|exists:tags,id',
    ];

    protected $listeners = ['tagCreated' => 'refreshTags'];

    public function boot(NoteServiceInterface $noteService, TagServiceInterface $tagService): void
    {
        $this->noteService = $noteService;
        $this->tagService = $tagService;
    }

    public function mount(): void
    {
        $this->tags = $this->tagService->all();
        $this->loadNotes();
    }

    public function loadNotes(): void
    {
        $this->notes = $this->noteService->listForUser(Auth::user());
    }

    public function refreshTags(): void
    {
        $this->tags = $this->tagService->all();
    }

    public function save(): void
    {
        $this->validate();

        $this->noteService->createForUser(
            Auth::user(),
            $this->text,
            (int) $this->tag_id,
        );

        $this->text = '';
        $this->tag_id = '';

        $this->loadNotes();

        session()->flash('message', 'Note added.');
    }

    public function delete($noteId): void
    {
        $this->noteService->deleteForUser(Auth::user(), (int) $noteId);
        $this->loadNotes();
    }

    public function render()
    {
        return view('livewire.notes');
    }
}
