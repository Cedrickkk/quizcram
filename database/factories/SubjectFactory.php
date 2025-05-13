<?php

namespace Database\Factories;

use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Subject>
 */
class SubjectFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(3),
            'description' => $this->faker->paragraphs(1, true),
            'image' => null, // Images are harder to fake, leave as null by default
            'created_at' => $this->faker->dateTimeBetween('-6 months', '-1 week'),
            'updated_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (\App\Models\Subject $subject) {
            // Create 3-8 quizzes for each subject
            $subject->quizzes()->saveMany(
                Quiz::factory()
                    ->count($this->faker->numberBetween(3, 8))
                    ->make(['subject_id' => $subject->id])
            );
        });
    }

    public function withImage()
    {
        return $this->state(function (array $attributes) {
            return [
                'image' => 'subject-images/lSHT7crEFUjNikbhELgk6dS2ukusqmpM3mMP3chC.jpg',
            ];
        });
    }
}
