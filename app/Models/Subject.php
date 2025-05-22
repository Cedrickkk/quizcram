<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;
    protected $fillable = [
        'user_id',
        'name',
        'image',
        'description',
    ];

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
