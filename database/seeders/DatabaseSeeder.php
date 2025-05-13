<?php

namespace Database\Seeders;

use App\Models\Question;
use App\Models\Quiz;
use App\Models\Subject;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $subject = Subject::factory()->create();

        Subject::factory()->withImage()->create();

        Subject::factory()->count(5)->create();

        $quiz = Quiz::factory()->create(['subject_id' => $subject->id]);

        Question::factory()->multipleChoice()->create(['quiz_id' => $quiz->id]);
    }
}
