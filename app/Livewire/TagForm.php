<?php

namespace App\Livewire;

use App\Contracts\TagServiceInterface;
use Livewire\Component;

class TagForm extends Component
{
    public $name = '';

    protected TagServiceInterface $tagService;

    protected $rules = [
        'name' => 'required|string|max:50|unique:tags,name',
    ];

    public function boot(TagServiceInterface $tagService): void
    {
        $this->tagService = $tagService;
    }

    public function save(): void
    {
        $this->validate();

        $this->tagService->create($this->name);

        $this->reset('name');

        $this->dispatch('tagCreated');

        session()->flash('message', 'Tag added!');
    }

    public function render()
    {
        return view('livewire.tag-form');
    }
}
