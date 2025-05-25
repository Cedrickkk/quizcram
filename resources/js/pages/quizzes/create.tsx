import AppLayout from '@/layouts/app-layout';
import QuizCreateQuestionLayout from '@/layouts/quizzes/create/layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import Question from './question';
import { Quiz } from './show';

type PageProps = {
  quiz: Quiz;
};

export default function Create() {
  const { quiz } = usePage<PageProps>().props;

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
    {
      title: 'New Questions',
      href: `/subjects/${quiz.subject.id}/quizzes/${quiz.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Quiz" />
      <QuizCreateQuestionLayout quiz={quiz}>
        <Question />
      </QuizCreateQuestionLayout>
    </AppLayout>
  );
}
