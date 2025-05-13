import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Recent Quizzes',
    href: '/recent-quizzes',
  },
];

export default function favorites() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Recent Quizzes" />
    </AppLayout>
  );
}
