import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileText } from 'lucide-react';
import { useMemo } from 'react';

type RecentQuiz = {
  id: number;
  quiz_id: number;
  subject_id: number;
  title: string;
  score: number;
  questions_count: number;
  time_spent: number;
  time_duration: number;
  completed_at: string;
  attempt_number: number;
  subject_title: string;
};

type GroupedQuiz = {
  quiz_id: number;
  subject_id: number;
  title: string;
  questions_count: number;
  time_duration: number;
  attemptCount: number;
  lastAttempt: RecentQuiz;
};

type Props = {
  recent: RecentQuiz[];
};

export default function RecentQuizzes({ recent }: Props) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Recent Quizzes',
      href: '/recent-quizzes',
    },
  ];

  const groupedQuizzes = useMemo(() => {
    const grouped: Record<number, GroupedQuiz> = {};

    recent.forEach(quiz => {
      if (!grouped[quiz.quiz_id]) {
        grouped[quiz.quiz_id] = {
          quiz_id: quiz.quiz_id,
          subject_id: quiz.subject_id,
          title: quiz.title,
          questions_count: quiz.questions_count,
          time_duration: quiz.time_duration,
          attemptCount: 1,
          lastAttempt: quiz,
        };
      } else {
        grouped[quiz.quiz_id].attemptCount++;

        if (new Date(quiz.completed_at) > new Date(grouped[quiz.quiz_id].lastAttempt.completed_at)) {
          grouped[quiz.quiz_id].lastAttempt = quiz;
        }
      }
    });

    return Object.values(grouped);
  }, [recent]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Recent Quizzes" />

      <div className="container p-6">
        <h1 className="mb-6 text-2xl font-bold">Recent Quizzes</h1>

        {groupedQuizzes.length > 0 ? (
          <div className="space-y-4">
            {groupedQuizzes.map(quiz => (
              <Card key={quiz.quiz_id} className="rounded-xs p-4">
                <div className="flex items-center justify-between">
                  <div className="mr-4 flex-shrink-0">
                    <div className="rounded-md bg-blue-50 p-4">
                      <FileText className="h-8 w-8 text-blue-500" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <div className="text-lg font-medium">{quiz.title}</div>
                    <div className="text-sm text-gray-500">
                      {quiz.questions_count} questions • {quiz.time_duration}
                    </div>
                    {quiz.attemptCount > 1 && (
                      <div className="mt-1 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                        Attempted {quiz.attemptCount} times
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex-shrink-0">
                    <Button asChild variant="outline">
                      <Link
                        href={route('subjects.quizzes.quiz.take', {
                          subject: quiz.subject_id,
                          quiz: quiz.quiz_id,
                        })}
                      >
                        Retake Quiz
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
            <h2 className="mb-1 text-xl font-medium text-gray-900">No recent quizzes</h2>
            <p className="mb-6 text-gray-500">Take some quizzes to see them here</p>
            <Button asChild>
              <Link href={route('subjects.index')}>Browse Subjects</Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
