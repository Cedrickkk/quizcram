import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Analytics',
    href: '/analytics',
  },
];

export default function favorites() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Analytics" />
    </AppLayout>
  );
}
