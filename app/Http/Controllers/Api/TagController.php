<?php

namespace App\Http\Controllers\Api;

use App\Contracts\TagServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TagController extends Controller
{
    public function __construct(
        private readonly TagServiceInterface $tags,
    ) {}

    public function index(): JsonResponse
    {
        return response()->json($this->tags->all());
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:50', 'unique:tags,name'],
        ]);

        $tag = $this->tags->create($data['name']);

        return response()->json($tag, 201);
    }
}
