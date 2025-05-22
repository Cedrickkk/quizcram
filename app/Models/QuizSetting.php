<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class QuizSetting extends Model
{
    protected $fillable = [
        'quiz_id',
        'use_default_settings',
        'question_order',
        'display_format',
        'show_question_number',
        'visible_timer',
        'question_required',
        'show_correct_answers',
        'passing_threshold',
    ];
}
