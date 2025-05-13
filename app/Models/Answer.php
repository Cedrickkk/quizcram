<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{

    use HasFactory;

    protected $table = 'answer_options';

    protected $fillable = [
        'question_id',
        'text',
        'is_correct',
        'order_number',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
