<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Subject;
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

        return Inertia::render('subjects/details', [
            'subject' => [
                'id' => $subject->id,
                'title' => $subject->title,
                'description' => $subject->description,
                'image' => $subject->image ? Storage::url($subject->image) : null,
                'created_at' => $subject->created_at,
                'updated_at' => $subject->updated_at,
                'total_quizzes' => $subject->quizzes->count(),
                'avg_duration' =>        CarbonInterval::seconds($subject->quizzes->avg('time_duration') ?? 0)->cascade()->forHumans([
                    'parts' => 1,
                    'short' => true,
                ]), // TODO: Calculate this from actual quiz attempts
                'avg_accuracy' => 40, // TODO: Calculate this from actual quiz attempts
                'total_points' => $subject->quizzes->sum('points') ?? 0,
                'quizzes' => $subject->quizzes->map(function ($quiz) {

                    $totalQuestions = $quiz->questions()->count();
                    return [
                        'id' => $quiz->id,
                        'title' => $quiz->title,
                        'time_duration' => CarbonInterval::seconds($quiz->time_duration)->cascade()->forHumans([
                            'parts' => 1,
                            'short' => true,
                        ]),
                        'total_questions' => $totalQuestions,
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


    public function quizzes(Subject $subject)
    {
        return Inertia::render('subjects/quizzes', [
            'subject' => $subject,
            'quizzes' => $subject->quizzes->map(function ($quiz) {
                $totalQuestions = $quiz->questions()->count();
                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'time_duration' => CarbonInterval::seconds($quiz->time_duration)->cascade()->forHumans([
                        'parts' => 1,
                        'short' => true,
                    ]),
                    'total_questions' => $totalQuestions,
                ];
            }),
        ]);
    }


    public function archive(Request $request)
    {
        dd($request);
    }
}
