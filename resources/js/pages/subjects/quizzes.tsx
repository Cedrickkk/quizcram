import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import SubjectLayout from '@/layouts/subjects/layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { FileText, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import CreateQuizTitleDialog from '../quizzes/create-quiz-title-dialog';
import { Quiz, Subject } from './details';

type PageProps = {
  subject: Subject;
  quizzes: Quiz[];
};

export default function Quizzes() {
  const [showCreateQuizTitleDialog, setShowCreateQuizTitleDialog] = useState(false);
  const { subject, quizzes } = usePage<PageProps>().props;

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Subjects',
      href: '/subjects',
    },
    {
      title: subject.title,
      href: `/subjects/${subject.id}`,
    },
    {
      title: 'Quizzes',
      href: `/subjects/${subject.id}/quizzes`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="DETAILS" />
      <SubjectLayout subject={subject}>
        <div className="mb-6 flex items-center justify-between pt-6">
          <h2 className="text-xl font-semibold">All Quizzes ({subject.quizzes.length})</h2>
          <Button onClick={() => setShowCreateQuizTitleDialog(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Quiz
          </Button>
        </div>

        <div className="my-8 grid grid-cols-1 gap-4">
          {quizzes.map(quiz => (
            <Card key={quiz.id} className="rounded-none bg-white py-4">
              <CardContent className="p-0">
                <Link
                  href={route('subjects.quizzes.quiz.show', { subject: subject.id, quiz: quiz.id })}
                  className="flex items-center px-6 py-2 transition-colors hover:bg-gray-50"
                >
                  <div className="mr-4 rounded-full bg-blue-50 p-3">
                    <FileText className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-medium">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">
                      {quiz.total_questions} questions • {quiz.time_duration ? `${quiz.time_duration}` : 'No time limit'}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-2">
                    {quiz.created_at}
                  </Badge>
                </Link>
              </CardContent>
            </Card>
          ))}

          {quizzes.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
              <h3 className="mb-1 text-lg font-medium text-gray-900">No quizzes yet</h3>
              <p className="mb-6 text-gray-500">Get started by creating your first quiz</p>
              <Button onClick={() => setShowCreateQuizTitleDialog(true)}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Quiz
              </Button>
            </div>
          )}
        </div>
      </SubjectLayout>
      <CreateQuizTitleDialog
        open={showCreateQuizTitleDialog}
        onOpenChange={setShowCreateQuizTitleDialog}
        subjectId={subject.id}
        subjectTitle={subject.title}
      />
    </AppLayout>
  );
}
