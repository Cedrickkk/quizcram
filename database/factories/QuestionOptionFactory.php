<?php

namespace Database\Factories;

use App\Models\Question;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\QuestionOptionFactory>
 */
class QuestionOptionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'question_id' => Question::factory(),
            'text' => $this->faker->sentence(3),
            'is_correct' => $this->faker->boolean(25), // 25% chance of being correct
            'order_number' => $this->faker->numberBetween(1, 4),
        ];
    }

    public function correct()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_correct' => true,
            ];
        });
    }

    public function incorrect()
    {
        return $this->state(function (array $attributes) {
            return [
                'is_correct' => false,
            ];
        });
    }
}
