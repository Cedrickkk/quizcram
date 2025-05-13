<?php

namespace Database\Factories;

use App\Models\Question;
use App\Models\Subject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Quiz>
 */
class QuizFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'subject_id' => Subject::factory(),
            'title' => $this->faker->sentence(4),
            'time_duration' => $this->faker->optional(0.7, null)->numberBetween(10, 60) * 60,
            'max_attempts' => $this->faker->optional(0.6, null)->numberBetween(1, 5),
            'is_archived' => $this->faker->boolean(10), // 10% chance of being archived
            'created_at' => $this->faker->dateTimeBetween('-6 months', '-1 week'),
            'updated_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (\App\Models\Quiz $quiz) {
            // Create 5-15 questions for each quiz
            $quiz->questions()->saveMany(
                Question::factory()
                    ->count($this->faker->numberBetween(5, 15))
                    ->make(['quiz_id' => $quiz->id])
            );
        });
    }

    public function notArchived()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_archived' => false,
            ];
        });
    }

    public function archived()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_archived' => true,
            ];
        });
    }
}
