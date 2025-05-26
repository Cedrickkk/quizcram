<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\QuizSetting;
use App\Models\SystemSetting; // Add this line
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;

class QuizSettingController extends Controller
{
    public function update(Request $request, Quiz $quiz)
    {

        $validatedData = $request->validate([
            'use_default_settings' => 'required|boolean',
            'question_order' => [
                Rule::requiredIf(!$request->input('use_default_settings')),
                'nullable',
                Rule::in(['sequential', 'random']),
            ],
            'display_format' => [
                Rule::requiredIf(!$request->input('use_default_settings')),
                'nullable',
                Rule::in(['one_per_page', 'all_on_page']),
            ],
            'show_question_number' => [
                Rule::requiredIf(!$request->input('use_default_settings')),
                'nullable',
                'boolean',
            ],
            'visible_timer' => [
                Rule::requiredIf(!$request->input('use_default_settings')),
                'nullable',
                'boolean',
            ],
            'question_required' => [
                Rule::requiredIf(!$request->input('use_default_settings')),
                'nullable',
                'boolean',
            ],
            'show_correct_answers' => [
                Rule::requiredIf(!$request->input('use_default_settings')),
                'nullable',
                Rule::in(['immediately', 'after_quiz']),
            ],
            'passing_threshold' => [
                Rule::requiredIf(!$request->input('use_default_settings')),
                'nullable',
                'integer',
                'min:0',
                'max:100',
            ],
        ]);

        $quizSetting = QuizSetting::firstOrNew(['quiz_id' => $quiz->id]);

        if ($validatedData['use_default_settings']) {
            $systemSettings = SystemSetting::first(); // Fetch system default settings

            $quizSetting->fill([
                'quiz_id' => $quiz->id,
                'use_default_settings' => true,
                'question_order' => $systemSettings->question_order ?? 'sequential',
                'display_format' => $systemSettings->display_format ?? 'one_per_page',
                'show_question_number' => $systemSettings->show_question_number ?? true,
                'visible_timer' => $systemSettings->visible_timer ?? true,
                'question_required' => $systemSettings->question_required ?? true,
                'show_correct_answers' => $systemSettings->show_correct_answers ?? 'after_quiz',
                'passing_threshold' => $systemSettings->passing_threshold ?? 70,
            ]);
        } else {
            $quizSetting->fill($validatedData);
            $quizSetting->quiz_id = $quiz->id;
        }

        $quizSetting->save();
    }
}
