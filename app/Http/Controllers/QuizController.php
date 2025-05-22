<?php

namespace App\Http\Controllers;

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

    public function create(Subject $subject)
    {
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
                'time_duration' => 900,  // 15 minutes
                'max_attempts' => null,
            ]);
        }

        return Inertia::render('quizzes/create', [
            'subject' => $subject,
            'systemSettings' => $systemSettings,
        ]);
    }

    public function show(Subject $subject, Quiz $quiz)
    {
        if ($quiz->subject_id !== $subject->id) {
            abort(404);
        }

        $quiz->load([
            'questions' => function ($query) {
                $query->with('answers')->orderBy('order_number');
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

        $effectiveSettings = $this->getEffectiveSettings($quiz->settings, $systemSettings);

        return Inertia::render('quizzes/show', [
            'quiz' => $quiz,
            'subject' => $subject,
            'questions' => $quiz->questions,
            'effectiveSettings' => $effectiveSettings,
            'userCanEdit' => $quiz->user_id === Auth::id() || Auth::user()->can('edit', $quiz),
        ]);
    }

    public function store(Request $request)
    {
        // Validate main quiz data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'subject_id' => 'required|exists:subjects,id',
            'time_duration' => 'nullable|integer|min:0',
            'max_attempts' => 'nullable|integer|min:1',
            'override_settings' => 'boolean',
            'settings' => 'required|array',
            'questions' => 'required|array|min:1',
        ]);

        // Start a database transaction
        DB::beginTransaction();

        try {
            // Create the quiz
            $quiz = Quiz::create([
                'title' => $validated['title'],
                'subject_id' => $validated['subject_id'],
                'time_duration' => $validated['time_duration'],
                'max_attempts' => $validated['max_attempts'],
            ]);

            // Create quiz settings if custom settings are enabled
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
                // Use default settings
                $quiz->quizSettings()->create([
                    'use_default_settings' => true,
                ]);
            }

            // Process questions
            foreach ($request->questions as $index => $questionData) {
                $question = $quiz->questions()->create([
                    'text' => $questionData['text'],
                    'type' => $questionData['type'],
                    'points' => $questionData['points'],
                    'order_number' => $index + 1,
                ]);

                // Process answers
                foreach ($questionData['answers'] as $answerIndex => $answerData) {
                    $question->answers()->create([
                        'text' => $answerData['text'],
                        'is_correct' => $answerData['is_correct'],
                        'order_number' => $answerIndex + 1,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('quizzes.show', $quiz->id)
                ->with('success', 'Quiz created successfully');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Failed to create quiz: ' . $e->getMessage()]);
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
}
