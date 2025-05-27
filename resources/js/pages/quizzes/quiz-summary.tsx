import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle, CheckCircle2, XCircle } from 'lucide-react';

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
  options: Option[];
};

type Score = {
  correctCount: number;
  percentage: number;
  earnedPoints: number;
  totalPoints: number;
  pointsPercentage: number;
};

interface QuizSummaryProps {
  score: Score;
  questions: Question[];
  selectedAnswers: Record<number, number>;
  onReturnToQuizzes: () => void;
}

const QuizSummary: React.FC<QuizSummaryProps> = ({ score, questions, selectedAnswers, onReturnToQuizzes }) => {
  return (
    <div className="border-t bg-gradient-to-r from-amber-50 to-blue-50 p-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            <h2 className="text-xl font-semibold">Quiz Completed!</h2>
          </div>

          <div className="mb-4 text-gray-600">
            You scored {score.earnedPoints} out of {score.totalPoints} points
          </div>

          <div className="mb-6">
            <div className="relative mb-2 h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className={cn(
                  'absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out',
                  score.percentage >= 80
                    ? 'bg-green-500'
                    : score.percentage >= 60
                      ? 'bg-emerald-500'
                      : score.percentage >= 40
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                )}
                style={{ width: `${score.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>0%</span>
              <span className="font-medium">{score.percentage}%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="rounded-lg border border-green-100 bg-green-50 p-3">
              <div className="text-2xl font-bold text-green-700">{score.correctCount}</div>
              <div className="text-sm text-green-600">Correct</div>
            </div>
            <div className="rounded-lg border border-red-100 bg-red-50 p-3">
              <div className="text-2xl font-bold text-red-700">{questions.length - score.correctCount}</div>
              <div className="text-sm text-red-600">Incorrect</div>
            </div>
          </div>
        </div>

        {/* Questions and Answers Section */}
        <div className="mt-8 space-y-6 divide-y divide-gray-200">
          <h3 className="text-lg font-medium">Question Review</h3>

          {questions.map((question, index) => {
            const selectedOptionId = selectedAnswers[question.id];
            const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
            const isCorrect = selectedOption?.is_correct;

            return (
              <div key={question.id} className="pt-4">
                <div className="flex items-start space-x-2">
                  <div className="mt-0.5 flex-shrink-0">
                    {isCorrect ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                  </div>
                  <div>
                    <h4 className="font-medium">
                      <span className="mr-2">{index + 1}.</span>
                      {question.text}
                    </h4>

                    <div className="mt-2 space-y-2">
                      {question.options.map(option => (
                        <div
                          key={option.id}
                          className={cn(
                            'flex items-center rounded-md border p-3',
                            option.id === selectedOptionId && option.is_correct && 'border-green-200 bg-green-50',
                            option.id === selectedOptionId && !option.is_correct && 'border-red-200 bg-red-50',
                            option.is_correct && option.id !== selectedOptionId && 'border-green-200 bg-green-50/30',
                            !option.is_correct && option.id !== selectedOptionId && 'border-gray-200'
                          )}
                        >
                          <div className="mr-3">
                            {option.id === selectedOptionId && option.is_correct && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                            {option.id === selectedOptionId && !option.is_correct && <XCircle className="h-4 w-4 text-red-500" />}
                            {option.is_correct && option.id !== selectedOptionId && <CheckCircle2 className="h-4 w-4 text-green-400/70" />}
                          </div>
                          <div
                            className={cn(
                              option.is_correct && 'font-medium text-green-800',
                              option.id === selectedOptionId && !option.is_correct && 'text-red-800'
                            )}
                          >
                            {option.text}
                            {option.id === selectedOptionId && <span className="ml-2 text-xs font-normal text-gray-500">(Your answer)</span>}
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

        <div className="mt-8 text-center">
          <Button className="bg-primary hover:bg-primary/90" onClick={onReturnToQuizzes}>
            Return to Quizzes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizSummary;
