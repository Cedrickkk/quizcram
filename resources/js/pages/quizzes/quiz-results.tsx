import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Head, Link } from '@inertiajs/react';
import confetti from 'canvas-confetti';
import { CheckCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';
import { useEffect } from 'react';

type Option = {
  id: number;
  text: string;
  is_correct: boolean;
};

type Question = {
  id: number;
  text: string;
  type: string;
  points: number;
  required: boolean;
  order_number: number;
  options: Option[];
  user_answer: {
    selected_option_id: number;
    is_correct: boolean;
  } | null;
};

type Quiz = {
  id: number;
  title: string;
  time_duration: number;
  subject_id: number;
  subject_title: string;
};

type UserQuiz = {
  id: number;
  score: number;
  total_questions_answered: number;
  time_spent: number;
  started_at: string;
  completed_at: string;
  attempt_number: number;
};

type PageProps = {
  quiz: Quiz;
  user_quiz: UserQuiz;
  questions: Question[];
};

export default function QuizResults({ quiz, user_quiz, questions }: PageProps) {
  // Show confetti when the page loads
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
      });
    }, 200);

    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
      });
    }, 400);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  // Calculate statistics
  const correctAnswers = questions.filter(q => q.user_answer?.is_correct).length;
  const incorrectAnswers = questions.filter(q => q.user_answer && !q.user_answer.is_correct).length;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
      <Head title={`Quiz Results: ${quiz.title}`} />

      <div className="container mx-auto max-w-4xl px-4">
        <Card className="overflow-hidden rounded-md shadow-md">
          <div className="border-b bg-gradient-to-r from-green-50 to-blue-50 p-6 text-center">
            <div className="mb-6 flex items-center justify-center gap-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <h1 className="text-2xl font-semibold">Quiz Completed!</h1>
            </div>

            <div className="mb-8 text-gray-600">
              You scored <span className="font-semibold">{user_quiz.score}%</span> on <span className="font-medium">{quiz.title}</span>
            </div>

            <div className="mx-auto mb-8 grid max-w-xl grid-cols-3 gap-4 text-center">
              <div className="rounded-lg border border-green-100 bg-green-50 p-4">
                <div className="text-2xl font-bold text-green-700">{correctAnswers}</div>
                <div className="text-sm text-green-600">Correct</div>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50 p-4">
                <div className="text-2xl font-bold text-red-700">{incorrectAnswers}</div>
                <div className="text-sm text-red-600">Incorrect</div>
              </div>
              <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-center justify-center">
                  <Clock className="mr-2 h-4 w-4 text-gray-500" />
                  <div className="text-xl font-bold text-gray-700">{formatTime(user_quiz.time_spent)}</div>
                </div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
            </div>

            <div className="relative mb-2 h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className={cn(
                  'absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out',
                  user_quiz.score >= 80
                    ? 'bg-green-500'
                    : user_quiz.score >= 60
                      ? 'bg-emerald-500'
                      : user_quiz.score >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                )}
                style={{ width: `${user_quiz.score}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>0%</span>
              <span className="font-medium">{user_quiz.score}%</span>
              <span>100%</span>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="mb-6 space-y-2">
              <h2 className="text-lg font-medium">Question Review</h2>
              <p className="text-sm text-gray-500">Review your answers to learn from your mistakes and improve for next time.</p>
            </div>

            <div className="space-y-8 divide-y divide-gray-100">
              {questions.map(question => {
                const selectedOptionId = question.user_answer?.selected_option_id;
                const isCorrect = question.user_answer?.is_correct;

                return (
                  <div key={question.id} className="pt-6">
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5 flex-shrink-0">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : question.user_answer ? (
                          <XCircle className="h-5 w-5 text-red-500" />
                        ) : (
                          <div className="h-5 w-5 rounded-full border border-gray-300" />
                        )}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-medium">
                          <span className="mr-2">{question.order_number}.</span>
                          {question.text}
                        </h3>

                        <div className="mt-3 space-y-2">
                          {question.options.map(option => (
                            <div
                              key={option.id}
                              className={cn(
                                'flex items-center rounded-md border p-3',
                                selectedOptionId === option.id && option.is_correct && 'border-green-200 bg-green-50',
                                selectedOptionId === option.id && !option.is_correct && 'border-red-200 bg-red-50',
                                option.is_correct && selectedOptionId !== option.id && 'border-green-200 bg-green-50/30',
                                !option.is_correct && selectedOptionId !== option.id && 'border-gray-200'
                              )}
                            >
                              <div className="mr-3 flex-shrink-0">
                                {selectedOptionId === option.id && option.is_correct && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                                {selectedOptionId === option.id && !option.is_correct && <XCircle className="h-4 w-4 text-red-500" />}
                                {option.is_correct && selectedOptionId !== option.id && <CheckCircle2 className="h-4 w-4 text-green-400/70" />}
                              </div>
                              <div
                                className={cn(
                                  'flex-grow',
                                  option.is_correct && 'font-medium text-green-800',
                                  selectedOptionId === option.id && !option.is_correct && 'text-red-800'
                                )}
                              >
                                {option.text}
                                {selectedOptionId === option.id && <span className="ml-2 text-xs font-normal text-gray-500">(Your answer)</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>

          <div className="border-t bg-gray-50 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Attempt #{user_quiz.attempt_number} • Completed{' '}
                {new Date(user_quiz.completed_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" asChild>
                  <Link href={route('subjects.subject.quizzes', { subject: quiz.subject_id })}>Back to Quizzes</Link>
                </Button>
                <Button className="bg-primary" asChild>
                  <Link href={route('subjects.quizzes.quiz.take', { subject: quiz.subject_id, quiz: quiz.id })}>Retry Quiz</Link>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
