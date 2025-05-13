<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
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
}
