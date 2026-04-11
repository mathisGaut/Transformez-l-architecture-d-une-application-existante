<?php

namespace App\Http\Controllers\Api;

use App\Contracts\NoteServiceInterface;
use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function __construct(
        private readonly NoteServiceInterface $notes,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $notes = $this->notes->listForUser($request->user());

        return response()->json($notes);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'text' => ['required', 'string'],
            'tag_id' => ['required', 'integer', 'exists:tags,id'],
        ]);

        $note = $this->notes->createForUser(
            $request->user(),
            $data['text'],
            (int) $data['tag_id'],
        );

        return response()->json($note->load('tag'), 201);
    }

    public function destroy(Request $request, int $id): JsonResponse
    {
        $this->notes->deleteForUser($request->user(), $id);

        return response()->json(null, 204);
    }
}
