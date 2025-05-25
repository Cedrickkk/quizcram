import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, PlusCircle, Settings } from 'lucide-react';
import { useState } from 'react';
import { Subject } from '../subjects/details';
import Question from './question';
import Questions from './questions';
import QuizSettingsDialog, { QuizSettings } from './show-quiz-settings-dialog';

type QuestionOptions = {
  id: number;
  question_id: number;
  text: string;
  is_correct: boolean;
  created_at: string;
  updated_at: string;
};

export type Question = {
  id: number;
  quiz_id: number;
  text: string;
  type: 'multiple_choice' | 'true_or_false' | 'short_answer';
  options: QuestionOptions[];
  points: number;
  order_number: number;
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

type PageProps = {
  quiz: Quiz;
};

export default function Show() {
  const { quiz } = usePage<PageProps>().props;
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

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={quiz.title} />
      <div className="container py-6">
        <div className="mb-6 flex items-start justify-between px-6 lg:px-9 lg:py-3">
          <div>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="text-muted-foreground text-sm">Subject: {quiz.subject.title}</p>
            <p className="text-muted-foreground text-sm">Total questions: {quiz.questions.length ?? 0}</p>
            <p className="text-muted-foreground text-sm">Last updated: {quiz.created_at}</p>
          </div>
          <Button variant="ghost" onClick={() => setShowQuizSettingsDialog(true)}>
            <Settings className="h-3.5" />
          </Button>
        </div>

        {quiz.questions.length && <Questions questions={quiz.questions} />}

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
      <QuizSettingsDialog open={showQuizSettingsDialog} onOpenChange={setShowQuizSettingsDialog} />
    </AppLayout>
  );
}
