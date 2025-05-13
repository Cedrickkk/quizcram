import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Archives',
    href: '/archives',
  },
];

export default function Archives() {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Archives" />
    </AppLayout>
  );
}
