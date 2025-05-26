<?php

namespace App\Http\Controllers;

use App\Models\QuestionOption;
use App\Models\Quiz;
use App\Models\QuizSetting;
use App\Models\Subject;
use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
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

        return Inertia::render('quizzes/show', [
            'quiz' => $quiz,
        ]);
    }

    public function store(Request $request)
    {
        dd($request);

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

    private function getEffectiveSettings(QuizSetting $quizSettings, SystemSetting $systemSettings): array
    {
        if (!$quizSettings || $quizSettings->use_default_settings) {
            return [
                'question_order' => $systemSettings->question_order,
                'display_format' => $systemSettings->display_format,
                'show_question_number' => $systemSettings->show_question_number,
                'visible_timer' => $systemSettings->visible_timer,
                'question_required' => $systemSettings->question_required,
                'show_correct_answers' => $systemSettings->show_correct_answers,
                'passing_threshold' => $systemSettings->passing_threshold,
            ];
        }

        return [
            'question_order' => $quizSettings->question_order ?? $systemSettings->question_order,
            'display_format' => $quizSettings->display_format ?? $systemSettings->display_format,
            'show_question_number' => $quizSettings->show_question_number ?? $systemSettings->show_question_number,
            'visible_timer' => $quizSettings->visible_timer ?? $systemSettings->visible_timer,
            'question_required' => $quizSettings->question_required ?? $systemSettings->question_required,
            'show_correct_answers' => $quizSettings->show_correct_answers ?? $systemSettings->show_correct_answers,
            'passing_threshold' => $quizSettings->passing_threshold ?? $systemSettings->passing_threshold,
        ];
    }

    public function saveQuestions(Request $request, Subject $subject, Quiz $quiz)
    {
        // Validate incoming request
        $validated = $request->validate([
            'questions' => 'required|array',
            'questions.*.text' => 'required|string',
            'questions.*.type' => 'required|string|in:multiple_choice,true_or_false,short_answer',
            'questions.*.points' => 'required|integer|min:1',
            'questions.*.required' => 'required|boolean',
            'questions.*.timeEstimation' => 'nullable|integer|min:0',
            'questions.*.orderNumber' => 'required|integer|min:1',
            'questions.*.randomizeOrder' => 'nullable|boolean',
            'questions.*.choices' => 'required|array',
            'questions.*.choices.*.text' => 'required|string',
            'questions.*.choices.*.isCorrect' => 'required|boolean',
            'questions.*.choices.*.orderNumber' => 'required|integer|min:1',
        ]);

        // Ensure the quiz belongs to the subject
        if ($quiz->subject_id !== $subject->id) {
            return back()->with(['message' => 'Quiz does not belong to this subject'], 403);
        }

        // Start a database transaction
        DB::beginTransaction();

        try {
            // First, remove all existing questions and their options
            // This approach replaces all questions rather than trying to update existing ones
            $existingQuestionIds = $quiz->questions()->pluck('id');

            // Delete all existing question options
            QuestionOption::whereIn('question_id', $existingQuestionIds)->delete();

            // Delete all existing questions
            $quiz->questions()->delete();

            // Create new questions from the request
            foreach ($validated['questions'] as $index => $questionData) {
                // Create the question
                $question = $quiz->questions()->create([
                    'quiz_id' => $quiz->id,
                    'text' => $questionData['text'],
                    'type' => $questionData['type'],
                    'points' => $questionData['points'],
                    'required' => $questionData['required'],
                    'time_estimation' => $questionData['timeEstimation'],
                    'order_number' => $index + 1, // Use the array index for consistent ordering
                    'randomize_order' => $questionData['randomizeOrder'] ?? false,
                ]);

                // Create question options/answers
                foreach ($questionData['choices'] as $choiceIndex => $choiceData) {
                    $question->options()->create([
                        'text' => $choiceData['text'],
                        'is_correct' => $choiceData['isCorrect'],
                        'order_number' => $choiceData['orderNumber'],
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

    public function udpateQuestion() {}

    public function deleteQuestion() {}
}
