<?php

namespace App\Contracts;

use App\Models\Tag;
use Illuminate\Support\Collection;

interface TagServiceInterface
{
    /**
     * @return \Illuminate\Database\Eloquent\Collection<int, Tag>
     */
    public function all(): Collection;

    public function create(string $name): Tag;
}
