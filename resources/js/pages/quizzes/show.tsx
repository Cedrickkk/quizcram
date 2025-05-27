import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Auth, BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Award, BarChart4, BookOpen, Calendar, FileText, Medal, Play, PlusCircle, Settings, Timer, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Subject } from '../subjects/details';
import QuizSettingsDialog, { QuizSettings } from './show-quiz-settings-dialog';

type QuestionOptions = {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
  order_number: number;
  created_at: string;
  updated_at: string;
};

type QuestionOrderType = 'keep_choices_in_current_order' | 'randomize';

export type QuestionType = 'multiple_choice' | 'true_or_false' | 'short_answer';

export type Question = {
  id: number;
  quiz_id: number;
  text: string;
  type: QuestionType;
  options: QuestionOptions[];
  required: boolean;
  points: number;
  order_number: number;
  order: QuestionOrderType;
  time_estimation: number;
  image: string | null;
  created_at: string;
  updated_at: string;
};

export type Quiz = {
  id: number;
  subject_id: number;
  title: string;
  time_duration: number | null;
  max_attempts: number | null;
  is_archived: 0 | 1;
  questions: Question[];
  subject: Subject;
  settings: QuizSettings;
  created_at: string;
  updated_at: string;
};

type UserAttempt = {
  id: number;
  score: number;
  time_spent: number;
  created_at: string;
  attempt_number: number;
};

type LeaderboardEntry = {
  id: number;
  user_id: number;
  score: number;
  time_spent: number;
  created_at: string;
  user: {
    id: number;
    name: string;
  };
};

type UserProgress = {
  attempts: UserAttempt[];
  best_score: number;
  attempts_left: number | null;
  can_take_quiz: boolean;
};

type QuizStats = {
  total_attempts: number;
  average_score: number;
  average_time: number;
  completion_rate: number;
};

type PageProps = {
  auth: Auth;
  quiz: Quiz;
  user_progress: UserProgress;
  quiz_stats: QuizStats;
  leaderboard: LeaderboardEntry[];
  difficulty: string;
  total_points: number;
};

export default function Show() {
  const {
    quiz,
    user_progress,
    quiz_stats,
    leaderboard,
    difficulty,
    total_points,
    auth: { user },
  } = usePage<PageProps>().props;

  const [showQuizSettingsDialog, setShowQuizSettingsDialog] = useState(false);

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Subjects',
      href: '/subjects',
    },
    {
      title: quiz.subject.title,
      href: `/subjects/${quiz.subject.id}`,
    },
    {
      title: quiz.title,
      href: `/subjects/${quiz.subject.id}/quizzes/${quiz.id}`,
    },
  ];

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'text-green-500';
      case 'Medium':
        return 'text-amber-500';
      case 'Hard':
        return 'text-orange-500';
      case 'Very Hard':
        return 'text-red-500';
      default:
        return 'text-blue-500';
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={quiz.title} />
      <div className="container py-6">
        <div className="mb-6 flex items-start justify-between px-6 lg:px-9 lg:py-3">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{quiz.title}</h1>
              {difficulty && (
                <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${getDifficultyColor(difficulty)}`}>{difficulty}</span>
              )}
            </div>
            <p className="text-muted-foreground text-sm">Subject: {quiz.subject.title}</p>
            <p className="text-muted-foreground text-sm">Total questions: {quiz.questions.length ?? 0}</p>
            <p className="text-muted-foreground text-sm">Points available: {total_points}</p>
            <p className="text-muted-foreground text-sm">Last updated: {quiz.updated_at}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowQuizSettingsDialog(true)}>
              <Settings className="mr-1 h-4 w-4" />
              Settings
            </Button>
            {quiz.questions.length > 0 && user_progress.can_take_quiz && (
              <Button asChild variant="default">
                <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/take`}>
                  <Play className="mr-1 h-4 w-4" />
                  Take Quiz
                </Link>
              </Button>
            )}
            {quiz.questions.length > 0 && !user_progress.can_take_quiz && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button disabled variant="default">
                      <Play className="mr-1 h-4 w-4" />
                      Take Quiz
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>You've reached the maximum number of attempts for this quiz.</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="px-6">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="attempts">My Attempts</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid gap-4 md:grid-cols-3">
              <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/questions`}>
                <Card className="h-full rounded-xs transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Questions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{quiz.questions.length}</div>
                    <p className="text-muted-foreground text-xs">Total questions in this quiz</p>
                  </CardContent>
                </Card>
              </Link>

              <Card className="h-full rounded-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Time Limit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <Timer className="text-muted-foreground mr-2 h-4 w-4" />
                    <div className="text-2xl font-bold">{quiz.time_duration ? quiz.time_duration : 'No limit'} mins</div>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {quiz.settings.visible_timer ? 'Timer visible to users' : 'Timer hidden from users'}
                  </p>
                </CardContent>
              </Card>

              <Card className="h-full rounded-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Passing Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <BarChart4 className="text-muted-foreground mr-2 h-4 w-4" />
                    <div className="text-2xl font-bold">{quiz.settings.passing_threshold || 70}%</div>
                  </div>
                  <p className="text-muted-foreground text-xs">Required to pass this quiz</p>
                </CardContent>
              </Card>

              <Card className="h-full rounded-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total Attempts:</span>
                    <span className="font-medium">{quiz_stats.total_attempts}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Avg. Score:</span>
                    <span className="font-medium">{Math.round(quiz_stats.average_score)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Avg. Time:</span>
                    <span className="font-medium">{formatTime(quiz_stats.average_time)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Completion Rate:</span>
                    <span className="font-medium">{Math.round(quiz_stats.completion_rate)}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full rounded-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Attempts:</span>
                    <span className="font-medium">{user_progress.attempts.length}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Best Score:</span>
                    <span className="font-medium">{user_progress.best_score}%</span>
                  </div>
                  {quiz.max_attempts && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Attempts Left:</span>
                      <span className="font-medium">{user_progress.attempts_left}</span>
                    </div>
                  )}
                  <div>
                    <div className="mb-1 flex justify-between text-xs">
                      <span>Progress</span>
                      <span>{user_progress.best_score >= (quiz.settings.passing_threshold || 70) ? 'Passed' : 'Not Passed'}</span>
                    </div>
                    <Progress value={user_progress.best_score} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className="h-full rounded-xs">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Top Score</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {leaderboard.length > 0 ? (
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-amber-500" />
                      <div>
                        <p className="font-medium">{leaderboard[0].user.name}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span className="font-medium text-amber-500">{leaderboard[0].score}%</span>
                          <span className="mx-1">•</span>
                          <span>{formatTime(leaderboard[0].time_spent)}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No attempts yet</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="attempts">
            <Card className="rounded-xs">
              <CardHeader>
                <CardTitle>Your Quiz Attempts</CardTitle>
                <CardDescription>View your previous attempts and track your progress over time</CardDescription>
              </CardHeader>
              <CardContent>
                {user_progress.attempts.length > 0 ? (
                  <div className="space-y-4">
                    {user_progress.attempts.map(attempt => (
                      <div key={attempt.id} className="flex items-center justify-between rounded-md border p-4">
                        <div className="flex items-center space-x-4">
                          <div className="rounded-full bg-gray-100 p-2">
                            <Calendar className="h-4 w-4 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium">Attempt #{attempt.attempt_number}</p>
                            <p className="text-sm text-gray-500">
                              {attempt.created_at} • {formatTime(attempt.time_spent)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`text-lg font-bold ${
                              attempt.score >= (quiz.settings.passing_threshold || 70) ? 'text-green-500' : 'text-amber-500'
                            }`}
                          >
                            {attempt.score}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <BookOpen className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <h3 className="mb-1 text-lg font-medium text-gray-900">No attempts yet</h3>
                    <p className="mb-6 text-gray-500">Take the quiz to track your progress</p>
                    {user_progress.can_take_quiz && (
                      <Button asChild>
                        <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/take`}>
                          <Play className="mr-2 h-4 w-4" />
                          Take Quiz
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>

              {quiz.max_attempts && (
                <CardFooter className="border-t bg-gray-50 px-6 py-3">
                  <div className="flex w-full items-center justify-between">
                    <p className="text-sm text-gray-500">
                      {user_progress.attempts_left === 0
                        ? "You've reached the maximum number of attempts"
                        : `You have ${user_progress.attempts_left} attempt${user_progress.attempts_left !== 1 ? 's' : ''} remaining`}
                    </p>
                    {user_progress.can_take_quiz && (
                      <Button size="sm" asChild>
                        <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/take`}>
                          <Play className="mr-2 h-4 w-4" />
                          Take Quiz
                        </Link>
                      </Button>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card className="rounded-xs">
              <CardHeader>
                <CardTitle>Leaderboard</CardTitle>
                <CardDescription>See how you stack up against other users</CardDescription>
              </CardHeader>
              <CardContent>
                {leaderboard.length > 0 ? (
                  <div className="space-y-1">
                    {leaderboard.map((entry, index) => (
                      <div
                        key={entry.id}
                        className={`flex items-center justify-between rounded-md p-3 ${
                          index === 0
                            ? 'border border-amber-100 bg-amber-50'
                            : index === 1
                              ? 'border border-gray-100 bg-gray-50'
                              : index === 2
                                ? 'border border-orange-100 bg-orange-50'
                                : 'border'
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`mr-3 flex h-8 w-8 items-center justify-center rounded-full ${
                              index === 0 ? 'bg-amber-100' : index === 1 ? 'bg-gray-200' : index === 2 ? 'bg-orange-100' : 'bg-gray-100'
                            }`}
                          >
                            {index < 3 ? (
                              <Medal className={`h-4 w-4 ${index === 0 ? 'text-amber-500' : index === 1 ? 'text-gray-500' : 'text-orange-500'}`} />
                            ) : (
                              <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                            )}
                          </div>
                          <div>
                            <p className={`font-medium ${index < 3 ? 'text-gray-900' : 'text-gray-700'}`}>{entry.user.name}</p>
                            <p className="text-xs text-gray-500">{entry.created_at} </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p
                              className={`font-bold ${
                                index === 0 ? 'text-amber-600' : index === 1 ? 'text-gray-600' : index === 2 ? 'text-orange-600' : 'text-gray-600'
                              }`}
                            >
                              {entry.score}%
                            </p>
                            <p className="text-xs text-gray-500">{formatTime(entry.time_spent)}</p>
                          </div>
                          {entry.user_id === user.id && <Award className="h-5 w-5 text-blue-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Trophy className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                    <h3 className="mb-1 text-lg font-medium text-gray-900">No entries yet</h3>
                    <p className="mb-6 text-gray-500">Be the first to take this quiz and top the leaderboard!</p>
                    {user_progress.can_take_quiz && (
                      <Button asChild>
                        <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/take`}>
                          <Play className="mr-2 h-4 w-4" />
                          Take Quiz
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {quiz.questions.length === 0 && (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h3 className="mb-1 text-lg font-medium text-gray-900">No questions yet</h3>
            <p className="mb-6 text-gray-500">Get started by creating your first question</p>
            <Button asChild>
              <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/create`}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Question
              </Link>
            </Button>
          </div>
        )}
      </div>
      <QuizSettingsDialog settings={quiz.settings} open={showQuizSettingsDialog} onOpenChange={setShowQuizSettingsDialog} />
    </AppLayout>
  );
}
