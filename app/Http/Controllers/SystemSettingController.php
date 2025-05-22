<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SystemSettingController extends Controller
{
    public function index()
    {

        $settings = SystemSetting::firstOrCreate(['user_id' => Auth::id()]);

        if (!$settings->exists) {
            $settings->fill([
                'name' => 'Default Quiz Settings',
                'question_order' => 'sequential',
                'display_format' => 'one_per_page',
                'show_question_number' => true,
                'visible_timer' => true,
                'question_required' => true,
                'show_correct_answers' => 'after_quiz',
                'passing_threshold' => 70,
                'time_duration' => 900,
                'user_id' => Auth::id(),
            ]);

            $settings->save();
        }

        return Inertia::render('quiz-settings/index', [
            'settings' => [
                'id' => $settings->id,
                'name' => $settings->name,
                'question_order' => $settings->question_order,
                'display_format' => $settings->display_format,
                'show_question_number' => (bool) $settings->show_question_number,
                'visible_timer' => (bool) $settings->visible_timer,
                'question_required' => (bool) $settings->question_required,
                'show_correct_answers' => $settings->show_correct_answers,
                'passing_threshold' => $settings->passing_threshold,
                'time_duration' => $settings->time_duration,
                'max_attempts' => $settings->max_attempts,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'question_order' => 'required|in:sequential,random',
            'display_format' => 'required|in:one_per_page,all_on_page',
            'show_question_number' => 'required|boolean',
            'visible_timer' => 'required|boolean',
            'question_required' => 'required|boolean',
            'show_correct_answers' => 'required|in:immediately,after_quiz',
            'passing_threshold' => 'required|integer|min:0|max:100',
            'time_duration' => 'required|integer|min:0',
            'max_attempts' => 'nullable|integer|min:1',
        ]);

        $validated['user_id'] = Auth::id();

        SystemSetting::updateOrCreate(
            ['user_id' => Auth::id()],
            $validated
        );
    }

    public function update(Request $request, $id)
    {
        $setting = SystemSetting::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'question_order' => 'required|in:sequential,random',
            'display_format' => 'required|in:one_per_page,all_on_page',
            'show_question_number' => 'required|boolean',
            'visible_timer' => 'required|boolean',
            'question_required' => 'required|boolean',
            'show_correct_answers' => 'required|in:immediately,after_quiz',
            'passing_threshold' => 'required|integer|min:0|max:100',
            'time_duration' => 'required|integer|min:0',
            'max_attempts' => 'nullable|integer|min:1',
        ]);

        $setting->update($validated);
    }
}
