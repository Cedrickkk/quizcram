<?php

namespace App\Models;

use App\Casts\HumanReadableTime;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Quiz extends Model
{
    use HasFactory;
    protected $fillable = [
        'subject_id',
        'title',
        'time_duration',
        'max_attempts',
        'is_archived',
    ];

    protected $casts = [
        'created_at' => HumanReadableTime::class,
        'updated_at' => HumanReadableTime::class,
    ];

    public function subject()
    {
        return  $this->belongsTo(Subject::class);
    }

    public function settings()
    {
        return $this->hasOne(QuizSetting::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }

    public function getEffectiveSettings()
    {
        $userSettings = SystemSetting::where('user_id', Auth::id());

        if (!$userSettings) {
            $userSettings = SystemSetting::whereNull('user_id')->first() ?? new SystemSetting([
                'question_order' => 'sequential',
                'display_format' => 'one_per_page',
                'show_question_number' => true,
                'visible_timer' => true,
                'question_required' => true,
                'show_correct_answers' => 'after_quiz',
                'passing_threshold' => 70,
                'time_duration' => 900,
                'max_attempts' => null,
            ]);
        }

        return [
            'question_order' => $this->question_order ?? $userSettings->question_order,
            'display_format' => $this->display_format ?? $userSettings->display_format,
            'show_question_number' => $this->show_question_number ?? $userSettings->show_question_number,
            'visible_timer' => $this->visible_timer ?? $userSettings->visible_timer,
            'question_required' => $this->question_required ?? $userSettings->question_required,
            'show_correct_answers' => $this->show_correct_answers ?? $userSettings->show_correct_answers,
            'passing_threshold' => $this->passing_threshold ?? $userSettings->passing_threshold,
            'time_duration' => $this->time_duration ?? $userSettings->time_duration,
            'max_attempts' => $this->max_attempts ?? $userSettings->max_attempts,
        ];
    }


    public function hasCustomSettings()
    {
        return $this->question_order !== null ||
            $this->display_format !== null ||
            $this->show_question_number !== null ||
            $this->visible_timer !== null ||
            $this->question_required !== null ||
            $this->show_correct_answers !== null ||
            $this->passing_threshold !== null;
    }

    public function resetToDefaultSettings()
    {
        $this->question_order = null;
        $this->display_format = null;
        $this->show_question_number = null;
        $this->visible_timer = null;
        $this->question_required = null;
        $this->show_correct_answers = null;
        $this->passing_threshold = null;
        $this->save();

        return $this;
    }
}
