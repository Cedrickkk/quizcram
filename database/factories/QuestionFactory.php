<?php

namespace Database\Factories;

use App\Models\QuestionOption;
use App\Models\Quiz;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Question>
 */
class QuestionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $questionTypes = ['multiple_choice', 'true_or_false', 'short_answer'];

        return [
            'quiz_id' => Quiz::factory(),
            'text' => $this->faker->sentence(10) . '?',
            'type' => $this->faker->randomElement($questionTypes),
            'points' => $this->faker->numberBetween(1, 10),
            'order_number' => $this->faker->numberBetween(1, 20),
            'created_at' => $this->faker->dateTimeBetween('-6 months', '-1 week'),
            'updated_at' => $this->faker->dateTimeBetween('-1 week', 'now'),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (\App\Models\Question $question) {
            // Create answers for the question 
            // This requires an Answer model and factory, which I'll provide below
            if ($question->type === 'multiple_choice') {
                $correctAnswerIndex = $this->faker->numberBetween(0, 3);
                for ($i = 0; $i < 4; $i++) {
                    QuestionOption::factory()->create([
                        'question_id' => $question->id,
                        'text' => $this->faker->sentence(3),
                        'is_correct' => ($i === $correctAnswerIndex),
                    ]);
                }
            } else if ($question->type === 'true_false') {
                $isTrue = $this->faker->boolean;
                QuestionOption::factory()->create([
                    'question_id' => $question->id,
                    'text' => 'True',
                    'is_correct' => $isTrue,
                ]);
                QuestionOption::factory()->create([
                    'question_id' => $question->id,
                    'text' => 'False',
                    'is_correct' => !$isTrue,
                ]);
            } else if ($question->type === 'short_answer') {
                QuestionOption::factory()->create([
                    'question_id' => $question->id,
                    'text' => $this->faker->sentence(2),
                    'is_correct' => true,
                ]);
            }
        });
    }

    public function multipleChoice()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'multiple_choice',
            ];
        });
    }

    public function trueOrFalse()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'true_false',
            ];
        });
    }

    public function shortAnswer()
    {
        return $this->state(function (array $attributes) {
            return [
                'type' => 'short_answer',
            ];
        });
    }
}
