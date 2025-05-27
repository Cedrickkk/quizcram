<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Subject;
use App\Models\UserQuiz;
use Carbon\CarbonInterval;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SubjectController extends Controller
{

    public function index()
    {
        $subjects = Subject::where('user_id', Auth::id())
            ->paginate()
            ->through(function ($subject) {
                return [
                    'id' => $subject->id,
                    'title' => $subject->title,
                    'description' => $subject->description,
                    'image' => $subject->image ? Storage::url($subject->image) : null,
                    'created_at' => $subject->created_at,
                    'updated_at' => $subject->updated_at,
                    'total_quizzes' => $subject->quizzes->count(),
                ];
            });

        return Inertia::render('subjects/index', [
            'subjects' => $subjects,
        ]);
    }


    public function show(Subject $subject)
    {
        $subject = Subject::with(['quizzes' => function ($query) {
            $query->where('is_archived', false)
                ->orderBy('created_at', 'desc');
        }])->findOrFail($subject->id);

        $userId = Auth::id();
        $quizIds = $subject->quizzes->pluck('id')->toArray();

        $userQuizzes = UserQuiz::where('user_id', $userId)
            ->whereIn('quiz_id', $quizIds)
            ->get();

        $avgAccuracy = $userQuizzes->avg('score') ?? 0;

        $totalPoints = 0;
        foreach ($subject->quizzes as $quiz) {
            $totalPoints += $quiz->questions->sum('points');
        }

        $avgDuration = $userQuizzes->avg('time_spent') ?? 0;

        return Inertia::render('subjects/details', [
            'subject' => [
                'id' => $subject->id,
                'title' => $subject->title,
                'description' => $subject->description,
                'image' => $subject->image ? Storage::url($subject->image) : null,
                'created_at' => $subject->created_at,
                'updated_at' => $subject->updated_at,
                'total_quizzes' => $subject->quizzes->count(),
                'is_favorited' => $subject->is_favorited,
                'avg_duration' => CarbonInterval::seconds($avgDuration)->cascade()->forHumans([
                    'parts' => 1,
                    'short' => true,
                ]),
                'avg_accuracy' => round($avgAccuracy, 1),
                'total_points' => $totalPoints,
                'total_attempts' => $userQuizzes->count(),
                'quizzes' => $subject->quizzes->map(function ($quiz) use ($userId) {
                    $totalQuestions = $quiz->questions()->count();

                    $userAttempts = UserQuiz::where('user_id', $userId)
                        ->where('quiz_id', $quiz->id)
                        ->get();

                    $bestScore = $userAttempts->max('score') ?? 0;

                    return [
                        'id' => $quiz->id,
                        'title' => $quiz->title,
                        'time_duration' => CarbonInterval::seconds($quiz->time_duration)->cascade()->forHumans([
                            'parts' => 1,
                            'short' => true,
                        ]),
                        'total_questions' => $totalQuestions,
                        'user_has_attempted' => $userAttempts->count() > 0,
                        'user_attempt_count' => $userAttempts->count(),
                        'best_score' => round($bestScore, 0),
                    ];
                }),
            ],
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string', 'max:300'],
            'image' => ['nullable', 'image', 'mimes:jpeg,png,jpg', 'max:2048']
        ]);

        $subject = new Subject();
        $subject->title = $validated['title'];
        $subject->user_id = Auth::id();
        $subject->description = $validated['description'] ?? null;

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('subject-images', 'public');
            $subject->image = $imagePath;
        }

        $subject->save();
    }


    // public function quizzes(Subject $subject)
    // {
    //     return Inertia::render('subjects/quizzes', [
    //         'subject' => $subject,
    //         'quizzes' => $subject->quizzes->map(function ($quiz) {
    //             $totalQuestions = $quiz->questions()->count();
    //             return [
    //                 'id' => $quiz->id,
    //                 'title' => $quiz->title,
    //                 'time_duration' => CarbonInterval::seconds($quiz->time_duration)->cascade()->forHumans([
    //                     'parts' => 1,
    //                     'short' => true,
    //                 ]),
    //                 'total_questions' => $totalQuestions,
    //             ];
    //         }),
    //     ]);
    // }


    public function quizzes(Subject $subject)
    {
        $userId = Auth::id();

        return Inertia::render('subjects/quizzes', [
            'subject' => $subject,
            'quizzes' => $subject->quizzes->map(function ($quiz) use ($userId) {
                $totalQuestions = $quiz->questions()->count();

                $userAttempts = UserQuiz::where('user_id', $userId)
                    ->where('quiz_id', $quiz->id)
                    ->count();

                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'time_duration' => $quiz->time_duration,
                    'total_questions' => $totalQuestions,
                    'user_has_attempted' => $userAttempts > 0,
                    'user_attempt_count' => $userAttempts,
                    'max_attempts' => $quiz->max_attempts,
                    'attempts_remaining' => $quiz->max_attempts ? $quiz->max_attempts - $userAttempts : null,
                ];
            }),
        ]);
    }


    public function archive(Request $request)
    {
        dd($request);
    }
}
