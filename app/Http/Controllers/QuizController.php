<?php

namespace App\Http\Controllers;

use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizSetting;
use App\Models\Subject;
use App\Models\SystemSetting;
use App\Models\UserQuiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class QuizController extends Controller



{
    public function create(Subject $subject, Quiz $quiz)
    {
        $systemSettings = SystemSetting::where('user_id', Auth::id());

        if (!$systemSettings) {
            $systemSettings = new SystemSetting([
                'question_order' => 'sequential',
                'display_format' => 'one_per_page',
                'show_question_number' => true,
                'visible_timer' => true,
                'question_required' => true,
                'show_correct_answers' => 'after_quiz',
                'passing_threshold' => 70,
                'time_duration' => 900,  // 15 minutes
                'max_attempts' => null,
            ]);
        }

        return Inertia::render('quizzes/create', [
            'quiz' => $quiz->load([
                'questions' => function ($query) {
                    $query->with('options')->orderBy('order_number');
                },
                'settings',
                'subject',
            ]),
        ]);
    }

    public function show(Subject $subject, Quiz $quiz)
    {
        if ($quiz->subject_id !== $subject->id) {
            abort(404);
        }

        $quiz->load([
            'questions' => function ($query) {
                $query->with('options')->orderBy('order_number');
            },
            'settings',
            'subject',
        ]);

        $systemSettings = SystemSetting::where('user_id', Auth::id())->first();

        if (!$systemSettings) {
            $systemSettings = new SystemSetting([
                'question_order' => 'sequential',
                'display_format' => 'one_per_page',
                'show_question_number' => true,
                'visible_timer' => true,
                'question_required' => true,
                'show_correct_answers' => 'after_quiz',
                'passing_threshold' => 70,
                'default_time_duration' => 900,
                'default_max_attempts' => null,
            ]);
        }

        $userAttempts = UserQuiz::where('user_id', Auth::id())
            ->where('quiz_id', $quiz->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get(['id', 'score', 'time_spent', 'created_at', 'attempt_number']);

        $bestScore = $userAttempts->max('score') ?? 0;

        $quizStats = [
            'total_attempts' => UserQuiz::where('quiz_id', $quiz->id)->count(),
            'average_score' => UserQuiz::where('quiz_id', $quiz->id)->avg('score') ?? 0,
            'average_time' => UserQuiz::where('quiz_id', $quiz->id)->avg('time_spent') ?? 0,
            'completion_rate' => $this->calculateCompletionRate($quiz->id),
        ];

        $leaderboard = UserQuiz::where('quiz_id', $quiz->id)
            ->with('user:id,name')
            ->orderBy('score', 'desc')
            ->orderBy('time_spent', 'asc')
            ->limit(5)
            ->get(['id', 'user_id', 'score', 'time_spent', 'created_at']);

        $difficulty = $this->calculateDifficulty($quizStats['average_score']);

        $totalPoints = $quiz->questions->sum('points');


        return Inertia::render('quizzes/show', [
            'quiz' => $quiz,
            'system_settings' => $systemSettings,
            'user_progress' => [
                'attempts' => $userAttempts,
                'best_score' => $bestScore,
                'attempts_left' => $quiz->max_attempts ? ($quiz->max_attempts - $userAttempts->count()) : null,
                'can_take_quiz' => $this->canUserTakeQuiz($quiz, $userAttempts->count()),
            ],
            'quiz_stats' => $quizStats,
            'leaderboard' => $leaderboard,
            'difficulty' => $difficulty,
            'total_points' => $totalPoints,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'time_duration' => 'nullable|integer|min:0',
            'max_attempts' => 'nullable|integer|min:1',
            'override_settings' => 'boolean',
            'settings' => 'required|array',
            'questions' => 'required|array|min:1',
        ]);

        DB::beginTransaction();

        try {
            $quiz = Quiz::create([
                'title' => $validated['title'],
                'subject_id' => $validated['subject_id'],
                'time_duration' => $validated['time_duration'],
                'max_attempts' => $validated['max_attempts'],
            ]);

            if ($validated['override_settings']) {
                $quiz->quizSettings()->create([
                    'use_default_settings' => false,
                    'question_order' => $validated['settings']['question_order'],
                    'display_format' => $validated['settings']['display_format'],
                    'show_question_number' => $validated['settings']['show_question_number'],
                    'visible_timer' => $validated['settings']['visible_timer'],
                    'question_required' => $validated['settings']['question_required'],
                    'show_correct_answers' => $validated['settings']['show_correct_answers'],
                    'passing_threshold' => $validated['settings']['passing_threshold'],
                ]);
            } else {
                $quiz->quizSettings()->create([
                    'use_default_settings' => true,
                ]);
            }

            foreach ($request->questions as $index => $questionData) {
                $question = $quiz->questions()->create([
                    'text' => $questionData['text'],
                    'type' => $questionData['type'],
                    'points' => $questionData['points'],
                    'order_number' => $index + 1,
                ]);

                foreach ($questionData['answers'] as $answerIndex => $answerData) {
                    $question->answers()->create([
                        'text' => $answerData['text'],
                        'is_correct' => $answerData['is_correct'],
                        'order_number' => $answerIndex + 1,
                    ]);
                }
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }
    }

    public function createTitle(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
        ]);

        $quiz = Quiz::create([
            'subject_id' => $validated['subject_id'],
            'title' => $validated['title'],
            'time_duration' => 900,
        ]);

        QuizSetting::create([
            'quiz_id' => $quiz->id,
            'question_order' => 'sequential',
            'display_format' => 'all_on_page',
            'show_question_number' => true,
            'visible_timer' => true,
            'question_required' => true,
            'show_correct_answers' => 'after_quiz',
            'passing_threshold' => 75,
        ]);
    }

    public function saveQuestions(Request $request, Subject $subject, Quiz $quiz)
    {
        $validated = $request->validate([
            'questions' => 'required|array',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|string|in:multiple_choice,true_or_false,short_answer',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.required' => 'required|boolean',
            'questions.*.time_estimation' => 'nullable|integer|min:0',
            'questions.*.order_number' => 'required|integer|min:1',
            'questions.*.order' => 'required|string|in:keep_choices_in_current_order,randomize',
            'questions.*.choices' => 'required|array',
            'questions.*.choices.*.text' => 'required|string',
            'questions.*.choices.*.is_correct' => 'required|boolean',
            'questions.*.choices.*.order_number' => 'required|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $highestOrderNumber = $quiz->questions()->max('order_number');

            $startOrderNumber = $highestOrderNumber + 1;

            foreach ($validated['questions'] as $index => $questionData) {

                $question = $quiz->questions()->create([
                    'quiz_id' => $quiz->id,
                    'text' => $questionData['text'],
                    'type' => $questionData['type'],
                    'points' => $questionData['points'],
                    'required' => $questionData['required'],
                    'time_estimation' => $questionData['time_estimation'],
                    'order_number' => $startOrderNumber + $index,
                    'order' => $questionData['order'] ?? "keep_choices_in_current_order",
                ]);

                foreach ($questionData['choices'] as $choiceIndex => $choiceData) {
                    $question->options()->create([
                        'text' => $choiceData['text'],
                        'is_correct' => $choiceData['is_correct'],
                        'order_number' => $choiceData['order_number'],
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }
    }

    public function showQuestions(Subject $subject, Quiz $quiz)
    {
        $quiz->load([
            'questions' => function ($query) {
                $query->with('options')->orderBy('order_number');
            },
            'settings',
            'subject',
        ]);

        return Inertia::render('quizzes/edit-questions', [
            'quiz' => $quiz->load([
                'questions' => function ($query) {
                    $query->with('options')->orderBy('order_number');
                },
                'settings',
                'subject',
            ]),
        ]);
    }

    public function updateQuestion(Request $request, Subject $subject, Quiz $quiz, $question)
    {
        $question = $quiz->questions()->findOrFail($question);

        $validated = $request->validate([
            'question.text' => 'required|string',
            'question.type' => 'required|string|in:multiple_choice,true_or_false,short_answer',
            'question.points' => 'required|integer|min:1',
            'question.required' => 'required|boolean',
            'question.time_estimation' => 'nullable|integer|min:0',
            'question.order' => 'nullable|string|in:keep_choices_in_current_order,randomize',
            'question.options' => 'required|array|min:2',
            'question.options.*.id' => 'nullable',
            'question.options.*.text' => 'required|string',
            'question.options.*.is_correct' => 'required|boolean',
            'question.options.*.order_number' => 'nullable|integer|min:1',
        ]);

        DB::beginTransaction();

        try {
            $question->update([
                'text' => $validated['question']['text'],
                'type' => $validated['question']['type'],
                'points' => $validated['question']['points'],
                'required' => $validated['question']['required'],
                'time_estimation' => $validated['question']['time_estimation'],
                'order' => $validated['question']['order'],
            ]);

            $existingOptionIds = $question->options()->pluck('id')->toArray();
            $updatedOptionIds = [];

            foreach ($validated['question']['options'] as $optionData) {
                if (isset($optionData['id']) && !empty($optionData['id']) && in_array($optionData['id'], $existingOptionIds)) {
                    $option = $question->options()->find($optionData['id']);
                    if ($option) {
                        $option->update([
                            'text' => $optionData['text'],
                            'is_correct' => $optionData['is_correct'],
                            'order_number' => $optionData['order_number'] ?? 0,
                        ]);
                        $updatedOptionIds[] = $option->id;
                    }
                } else {
                    $option = $question->options()->create([
                        'text' => $optionData['text'],
                        'is_correct' => $optionData['is_correct'],
                        'order_number' => $optionData['order_number'],
                    ]);
                    $updatedOptionIds[] = $option->id;
                }
            }

            $optionsToDelete = array_diff($existingOptionIds, $updatedOptionIds);
            if (!empty($optionsToDelete)) {
                $question->options()->whereIn('id', $optionsToDelete)->delete();
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
        }
    }


    public function deleteQuestion(Request $request, Subject $subject, Quiz $quiz, $question)
    {
        $question = $quiz->questions()->findOrFail($question);


        DB::beginTransaction();

        try {
            $question->options()->delete();

            $question->delete();

            $remainingQuestions = $quiz->questions()->orderBy('order_number')->get();
            foreach ($remainingQuestions as $index => $q) {
                $q->update(['order_number' => $index + 1]);
            }

            DB::commit();
            return back()->with('success', 'Question deleted successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->with('error', 'Failed to delete question: ' . $e->getMessage());
        }
    }

    public function takeQuiz(Subject $subject, Quiz $quiz)
    {
        if ($quiz->subject_id !== $subject->id) {
            abort(404);
        }

        $questions = $quiz->questions()->with('options')->get();

        $settings = $quiz->settings()->get();

        return Inertia::render('quizzes/take-quiz', [
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'time_duration' => $quiz->time_duration,
                'subject_id' => $subject->id,
                'subject_title' => $subject->title,
                'settings' => $settings,
            ],
            'questions' => $questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'text' => $question->text,
                    'type' => $question->type,
                    'points' => $question->points,
                    'time_estimation' => $question->time_estimation,
                    'required' => $question->required,
                    'order_number' => $question->order_number,
                    'options' => $question->options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'text' => $option->text,
                            'is_correct' => $option->is_correct,
                        ];
                    }),
                ];
            }),
        ]);
    }

    public function submitQuiz(Request $request, Subject $subject, Quiz $quiz)
    {
        $validated = $request->validate([
            'score' => 'required|numeric',
            'earned_points' => 'required|numeric',
            'total_points' => 'required|numeric',
            'total_questions_answered' => 'required|integer',
            'time_spent' => 'required|integer',
            'user_answers' => 'required|array',
            'user_answers.*.question_id' => 'required|integer|exists:questions,id',
            'user_answers.*.selected_option_id' => 'required|integer|exists:question_options,id',
            'user_answers.*.is_correct' => 'required|boolean',
        ]);

        $attemptNumber = UserQuiz::where('user_id', Auth::id())
            ->where('quiz_id', $quiz->id)
            ->max('attempt_number') + 1;

        $userQuiz = UserQuiz::create([
            'user_id' => Auth::id(),
            'quiz_id' => $quiz->id,
            'attempt_number' => $attemptNumber,
            'score' => $validated['score'],
            'total_questions_answered' => $validated['total_questions_answered'],
            'time_spent' => $validated['time_spent'],
            'started_at' => now()->subSeconds($validated['time_spent']), // Estimate start time
            'completed_at' => now(),
        ]);

        $userAnswers = [];
        foreach ($validated['user_answers'] as $answer) {
            $userAnswers[] = [
                'user_quiz_id' => $userQuiz->id,
                'question_id' => $answer['question_id'],
                'selected_option_id' => $answer['selected_option_id'],
                'is_correct' => $answer['is_correct'],
                'answered_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        DB::table('user_answers')->insert($userAnswers);
    }

    public function quizResults(Subject $subject, Quiz $quiz)
    {
        $userQuiz = UserQuiz::where('user_id', Auth::id())
            ->where('quiz_id', $quiz->id)
            ->latest()
            ->with(['userAnswers.question.options', 'userAnswers.selectedOption'])
            ->first();

        if (!$userQuiz) {
            return redirect()->route('subjects.subject.quizzes', ['subject' => $subject->id])
                ->with('error', 'No quiz attempts found.');
        }

        $quiz->load(['settings', 'questions' => function ($query) {
            $query->with('options')->orderBy('order_number');
        }]);

        return Inertia::render('quizzes/quiz-results', [
            'quiz' => [
                'id' => $quiz->id,
                'title' => $quiz->title,
                'time_duration' => $quiz->time_duration,
                'subject_id' => $subject->id,
                'subject_title' => $subject->title,
            ],
            'user_quiz' => [
                'id' => $userQuiz->id,
                'score' => $userQuiz->score,
                'total_questions_answered' => $userQuiz->total_questions_answered,
                'time_spent' => $userQuiz->time_spent,
                'started_at' => $userQuiz->started_at,
                'completed_at' => $userQuiz->completed_at,
                'attempt_number' => $userQuiz->attempt_number,
            ],
            'questions' => $quiz->questions->map(function ($question) use ($userQuiz) {
                $userAnswer = $userQuiz->userAnswers->firstWhere('question_id', $question->id);

                return [
                    'id' => $question->id,
                    'text' => $question->text,
                    'type' => $question->type,
                    'points' => $question->points,
                    'required' => $question->required,
                    'order_number' => $question->order_number,
                    'options' => $question->options->map(function ($option) {
                        return [
                            'id' => $option->id,
                            'text' => $option->text,
                            'is_correct' => $option->is_correct,
                        ];
                    }),
                    'user_answer' => $userAnswer ? [
                        'selected_option_id' => $userAnswer->selected_option_id,
                        'is_correct' => $userAnswer->is_correct,
                    ] : null,
                ];
            }),
        ]);
    }

    private function calculateDifficulty($averageScore)
    {
        if ($averageScore >= 90) {
            return 'Easy';
        } elseif ($averageScore >= 70) {
            return 'Medium';
        } elseif ($averageScore >= 50) {
            return 'Hard';
        } else {
            return 'Very Hard';
        }
    }

    private function calculateCompletionRate($quizId)
    {
        $totalStarted = UserQuiz::where('quiz_id', $quizId)->count();
        if ($totalStarted === 0) {
            return 0;
        }

        $totalCompleted = UserQuiz::where('quiz_id', $quizId)
            ->whereNotNull('score')
            ->count();

        return ($totalCompleted / $totalStarted) * 100;
    }

    private function canUserTakeQuiz($quiz, $currentAttempts)
    {
        if (!$quiz->max_attempts) {
            return true;
        }

        return $currentAttempts < $quiz->max_attempts;
    }
}
