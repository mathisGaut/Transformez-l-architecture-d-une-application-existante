<?php

namespace App\Services;

use App\Contracts\TagServiceInterface;
use App\Models\Tag;
use Illuminate\Support\Collection;

class TagService implements TagServiceInterface
{
    public function all(): Collection
    {
        return Tag::all();
    }

    public function create(string $name): Tag
    {
        return Tag::create(['name' => $name]);
    }
}
