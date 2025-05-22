<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'user_id',
        'question_order',
        'display_format',
        'show_question_number',
        'visible_timer',
        'question_required',
        'show_correct_answers',
        'passing_threshold',
        'time_duration',
        'max_attempts',
    ];

    protected $casts = [
        'show_question_number' => 'boolean',
        'visible_timer' => 'boolean',
        'question_required' => 'boolean',
        'passing_threshold' => 'integer',
        'time_duration' => 'integer',
        'max_attempts' => 'integer',
    ];
}
