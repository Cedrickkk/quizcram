<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

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

    public function subject()
    {
        return  $this->belongsTo(Subject::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class);
    }
}
