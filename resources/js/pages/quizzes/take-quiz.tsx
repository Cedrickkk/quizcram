import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import { AlertCircle, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTimer } from 'react-timer-hook';
import { toast, Toaster } from 'sonner';
import QuizSummary from './quiz-summary';

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
  time_estimation: number;
  order_number: number;
  options: Option[];
};

type QuizSettings = {
  id: number;
  quiz_id: number;
  use_default_settings: boolean;
  question_order: 'sequential' | 'randomize';
  display_format: 'one_per_page' | 'all_on_page';
  show_question_number: boolean;
  visible_timer: boolean;
  question_required: boolean;
  show_correct_answers: boolean | 'after_quiz' | 'immediately';
  passing_threshold: number;
};

type Quiz = {
  id: number;
  title: string;
  time_duration: number;
  subject_id: number;
  subject_title: string;
  settings: QuizSettings[];
};

type PageProps = {
  quiz: Quiz;
  questions: Question[];
};

export default function TakeQuiz({ quiz, questions }: PageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<number, boolean>>({});
  const [elapsedTime, setElapsedTime] = useState(0);

  const settings = quiz.settings[0];
  const displayFormat = settings.display_format;
  const showCorrectAnswers = settings.show_correct_answers;
  const questionRequired = settings.question_required;
  const visibleTimer = settings.visible_timer;
  const showQuestionNumber = settings.show_question_number;

  const expiryTime = new Date();
  expiryTime.setSeconds(expiryTime.getSeconds() + quiz.time_duration * 60);

  const { seconds, minutes, hours, isRunning, pause, restart } = useTimer({
    expiryTimestamp: expiryTime,
    onExpire: () => {
      if (!isSubmitted) {
        handleSubmit();
      }
    },
    autoStart: true,
  });

  useEffect(() => {
    if (isRunning && !isSubmitted) {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isRunning, isSubmitted]);

  const showCorrectAnswersImmediately = showCorrectAnswers === 'immediately';

  const totalQuestions = questions.length;
  const questionsAnswered = Object.keys(selectedAnswers).length;
  const questionsRemaining = totalQuestions - questionsAnswered;

  const currentQuestion = questions[currentQuestionIndex];

  const calculateScore = () => {
    let correctCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    questions.forEach(question => {
      totalPoints += question.points;
      const selectedOptionId = selectedAnswers[question.id];

      if (selectedOptionId) {
        const selectedOption = question.options.find(opt => opt.id === selectedOptionId);
        if (selectedOption?.is_correct) {
          correctCount++;
          earnedPoints += question.points;
        }
      }
    });

    return {
      correctCount,
      percentage: Math.round((correctCount / totalQuestions) * 100),
      earnedPoints,
      totalPoints,
      pointsPercentage: Math.round((earnedPoints / totalPoints) * 100),
    };
  };

  const score = isSubmitted ? calculateScore() : { correctCount: 0, percentage: 0, earnedPoints: 0, totalPoints: 0, pointsPercentage: 0 };

  const formatTimeLeft = () => {
    return `${String(hours * 60 + minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, optionId: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionId,
    });

    if (validationErrors[questionId]) {
      setValidationErrors({
        ...validationErrors,
        [questionId]: false,
      });
    }

    if (showCorrectAnswersImmediately && displayFormat === 'one_per_page' && !isSubmitted) {
      setTimeout(() => {
        if (currentQuestionIndex < totalQuestions - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    if (questionRequired && currentQuestion.required && !selectedAnswers[currentQuestion.id]) {
      setValidationErrors({
        ...validationErrors,
        [currentQuestion.id]: true,
      });
      return;
    }

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    if (isSubmitted) return;

    if (questionRequired) {
      const missingRequired = questions
        .filter(q => q.required)
        .filter(q => !selectedAnswers[q.id])
        .reduce<Record<number, boolean>>((acc, q) => ({ ...acc, [q.id]: true }), {});

      if (Object.keys(missingRequired).length > 0) {
        setValidationErrors(missingRequired);

        if (displayFormat === 'one_per_page') {
          const firstUnansweredIndex = questions.findIndex(q => missingRequired[q.id] === true);
          if (firstUnansweredIndex !== -1) {
            setCurrentQuestionIndex(firstUnansweredIndex);
          }
        }

        toast(
          <Alert className="text-destructive border-none p-0 font-sans" variant="destructive">
            <AlertTitle className="flex items-center gap-1.5 text-sm">Please answer all required questions</AlertTitle>
            <AlertDescription className="text-muted-foreground text-xs">
              You must answer all required questions before submitting the quiz.
            </AlertDescription>
          </Alert>
        );

        // If timer expired but required questions aren't answered, give extra time
        if (!isRunning) {
          const newTime = new Date();
          newTime.setSeconds(newTime.getSeconds() + 60); // 1 minute extra
          restart(newTime);
        }

        return;
      }
    }

    pause();

    const finalScore = calculateScore();
    const finalTimeSpent = elapsedTime;

    const userAnswers = Object.keys(selectedAnswers).map(questionId => {
      const qId = parseInt(questionId);
      const optionId = selectedAnswers[qId];
      const question = questions.find(q => q.id === qId);
      const option = question?.options.find(o => o.id === optionId);

      return {
        question_id: qId,
        selected_option_id: optionId,
        is_correct: option?.is_correct || false,
      };
    });

    setIsSubmitted(true);

    router.post(
      route('subjects.quizzes.submit', {
        subject: quiz.subject_id,
        quiz: quiz.id,
      }),
      {
        score: finalScore.percentage,
        earned_points: finalScore.earnedPoints,
        total_points: finalScore.totalPoints,
        total_questions_answered: Object.keys(selectedAnswers).length,
        time_spent: finalTimeSpent,
        user_answers: userAnswers,
      },
      {
        onSuccess: () => {
          router.visit(
            route('subjects.quizzes.results', {
              subject: quiz.subject_id,
              quiz: quiz.id,
            })
          );
        },
        showProgress: false,
      }
    );
  };

  const canShowCorrectAnswers = showCorrectAnswers && isSubmitted;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const renderQuestion = (question: Question, index: number) => {
    const isAnswered = selectedAnswers[question.id] !== undefined;
    const isError = validationErrors[question.id];
    const selectedOptionId = selectedAnswers[question.id];

    const showAnswerResults =
      canShowCorrectAnswers && (displayFormat === 'one_per_page' || (question.time_estimation && question.time_estimation > 0));

    return (
      <div key={question.id} className={cn('mb-8', displayFormat === 'one_per_page' && index !== currentQuestionIndex && 'hidden')}>
        <div className="bg-accent/50 mb-3 rounded-md border border-gray-200 p-4">
          <div className="flex items-start justify-between">
            <h2 className="text-base">
              {showQuestionNumber && <span className="mr-2">{question.order_number}.</span>}
              {question.text}
              {question.required && questionRequired && <span className="ml-1 text-red-500">*</span>}
            </h2>
            {displayFormat === 'all_on_page' && showQuestionNumber && (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs text-amber-800">
                Question {question.order_number} of {totalQuestions}
              </span>
            )}
          </div>
        </div>

        {isError && (
          <Alert variant="destructive" className="text-destructive mb-3 border-none px-2 py-0">
            <AlertCircle className="h-2 w-2" />
            <AlertDescription className="text-sm">This question requires an answer</AlertDescription>
          </Alert>
        )}

        <RadioGroup
          value={selectedOptionId !== undefined ? selectedOptionId.toString() : ''}
          onValueChange={value => {
            if (value) {
              handleAnswerSelect(question.id, parseInt(value));
            }
          }}
          className="gap-0 space-y-3"
        >
          {question.options.map(option => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.is_correct;
            const showCorrectIndicator = showAnswerResults && isCorrect;
            const showWrongIndicator = showAnswerResults && isSelected && !isCorrect;

            return (
              <div
                key={option.id}
                className={cn(
                  'flex cursor-pointer items-center rounded-md border border-gray-200 p-2',
                  isSelected && !showAnswerResults && 'border-amber-200 bg-amber-50',
                  showAnswerResults && isSelected && isCorrect && 'border-green-200 bg-green-50',
                  showAnswerResults && isSelected && !isCorrect && 'border-red-200 bg-red-50',
                  showAnswerResults && !isSelected && isCorrect && 'border-green-200 bg-green-50/50'
                )}
                onClick={() => {
                  if (!isSubmitted && !(showCorrectAnswersImmediately && isAnswered)) {
                    handleAnswerSelect(question.id, option.id);
                  }
                }}
              >
                <div className="flex items-center">
                  <RadioGroupItem
                    value={option.id.toString()}
                    id={option.id.toString()}
                    className="mr-2"
                    disabled={isSubmitted || (showCorrectAnswersImmediately && isAnswered)}
                  />

                  {isSelected && !showAnswerResults && <CheckCircle2 className="mr-2 h-4 w-4 text-amber-500" />}
                  {showCorrectIndicator && <CheckCircle2 className="mr-2 h-4 w-4 text-green-500" />}
                  {showWrongIndicator && <XCircle className="mr-2 h-4 w-4 text-red-500" />}
                </div>

                <Label
                  htmlFor={option.id.toString()}
                  className={cn(
                    'flex-1 cursor-pointer font-normal',
                    showAnswerResults && isCorrect && 'font-medium text-green-800',
                    showAnswerResults && isSelected && !isCorrect && 'text-red-800'
                  )}
                >
                  {option.text}
                </Label>
              </div>
            );
          })}
        </RadioGroup>
      </div>
    );
  };

  // Calculate time related displays
  const totalTimeLeftInSeconds = hours * 3600 + minutes * 60 + seconds;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-8">
      <Head title={`Quiz: ${quiz.title}`} />

      <div className="container mx-auto max-w-4xl px-4">
        <Card className="overflow-hidden rounded-md shadow-md">
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-semibold">{quiz.title}</h1>
              {displayFormat === 'one_per_page' && showQuestionNumber && (
                <div className="rounded-full bg-amber-100 px-4 py-1 text-sm font-medium text-amber-800">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </div>
              )}
            </div>

            {displayFormat === 'one_per_page' && (
              <div className="mt-4">
                <Progress value={((currentQuestionIndex + 1) / totalQuestions) * 100} className="h-2 bg-gray-200" />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>{Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%</span>
                </div>
              </div>
            )}

            {visibleTimer && (
              <div className="mt-2 text-right text-sm">
                <span className="font-medium">Time left: </span>
                <span className={totalTimeLeftInSeconds < 60 ? 'text-red-600' : totalTimeLeftInSeconds < 180 ? 'text-amber-600' : 'text-gray-600'}>
                  {formatTimeLeft()}
                </span>
              </div>
            )}
          </div>
          <CardContent className="space-y-6 p-6">
            {displayFormat === 'one_per_page'
              ? renderQuestion(currentQuestion, currentQuestionIndex)
              : questions.map((question, index) => renderQuestion(question, index))}

            <div className="flex justify-between border-t pt-4">
              {displayFormat === 'one_per_page' && (
                <>
                  <Button variant="outline" onClick={handlePreviousQuestion} disabled={currentQuestionIndex === 0 || isSubmitted}>
                    Previous
                  </Button>

                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <Button
                      onClick={handleNextQuestion}
                      disabled={isSubmitted || (questionRequired && currentQuestion.required && !selectedAnswers[currentQuestion.id])}
                    >
                      Next Question <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} variant="default" className="bg-green-600 hover:bg-green-700" disabled={isSubmitted}>
                      Submit Quiz
                    </Button>
                  )}
                </>
              )}

              {displayFormat === 'all_on_page' && (
                <Button onClick={handleSubmit} variant="default" className="ml-auto bg-green-600 hover:bg-green-700" disabled={isSubmitted}>
                  Submit Quiz
                </Button>
              )}
            </div>
          </CardContent>
          {isSubmitted && (
            <QuizSummary
              score={score}
              questions={questions}
              selectedAnswers={selectedAnswers}
              onReturnToQuizzes={() => {
                router.visit(route('subjects.quizzes', { subject: quiz.subject_id }));
              }}
            />
          )}
        </Card>

        {displayFormat === 'one_per_page' && (
          <div className="mt-6 grid grid-cols-3 rounded-md bg-white shadow-md">
            <div className="border-r p-6 text-center">
              <div
                className={cn(
                  'text-2xl font-bold',
                  isSubmitted &&
                    (score.percentage >= 80
                      ? 'text-green-500'
                      : score.percentage >= 60
                        ? 'text-emerald-500'
                        : score.percentage >= 40
                          ? 'text-amber-500'
                          : 'text-red-500'),
                  !isSubmitted && 'text-amber-500'
                )}
              >
                {isSubmitted ? `${score.percentage}%` : `${Math.round((questionsAnswered / totalQuestions) * 100)}%`}
              </div>
              <div className="text-sm text-gray-500">{isSubmitted ? 'Score' : 'Completed'}</div>
            </div>
            <div className="border-r p-6 text-center">
              <div className="text-2xl font-bold">{isSubmitted ? formatTime(elapsedTime) : formatTimeLeft()}</div>
              <div className="text-sm text-gray-500">{isSubmitted ? 'Time Spent' : 'Time Left'}</div>
            </div>
            <div className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-500">{isSubmitted ? score.correctCount : questionsRemaining}</div>
              <div className="text-sm text-gray-500">{isSubmitted ? 'Correct' : 'Remaining'}</div>
            </div>
          </div>
        )}
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
