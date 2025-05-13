import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Quiz Settings',
    href: '/quiz-settings',
  },
];

export default function favorites() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Quiz Settings" />
    </AppLayout>
  );
}
