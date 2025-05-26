<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $favoriteSubjectIds = Favorite::where('user_id', $user->id)
            ->pluck('subject_id');

        $favorites = Subject::with(['quizzes'])
            ->whereIn('id', $favoriteSubjectIds)
            ->get();

        $favorites->each(function ($subject) {
            $subject->is_favorited = true;
            $subject->image = $subject->image ? Storage::url($subject->image) : null;
        });

        return Inertia::render('favorites/index', [
            'favorites' => $favorites
        ]);
    }

    public function toggle(Request $request, Subject $subject)
    {
        $user = Auth::user();

        $favorite = Favorite::where('user_id', $user->id)
            ->where('subject_id', $subject->id)
            ->first();

        $isFavorited = false;

        if ($favorite) {
            $favorite->delete();
        } else {
            Favorite::create([
                'user_id' => $user->id,
                'subject_id' => $subject->id
            ]);
            $isFavorited = true;
        }

        $subject->is_favorited = $isFavorited;
        $subject->save();
    }
}
