<?php

namespace App\Models;

use App\Casts\HumanReadableTime;
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
        'is_favorited',
    ];

    protected $casts = [
        'created_at' => HumanReadableTime::class,
        'updated_at' => HumanReadableTime::class,
    ];

    public function quizzes()
    {
        return $this->hasMany(Quiz::class);
    }
}
