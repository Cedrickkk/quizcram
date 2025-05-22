import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Settings } from 'lucide-react';
import { useState } from 'react';
import { Subject } from '../subjects';
import QuizSettingsDialog from './show-quiz-settings-dialog';

type PageProps = {
  subject: Subject;
};

export default function Create() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { subject } = usePage<PageProps>().props;

  const { data, setData, errors } = useForm({
    title: '',
  });

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
      title: `${data.title ? data.title : 'Create Quiz'}`,
      href: `/subjects/${subject.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Quiz" />
      <div className="flex-1 p-6">
        <div className="flex items-end justify-between gap-4">
          <div className="w-1/2">
            <Label htmlFor="subject-title" className="text-base font-medium">
              Title
            </Label>
            <Input
              id="subject-title"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              placeholder="Enter quiz title"
              className="mt-1"
            />
            {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
          </div>
          <Button variant="ghost" size="lg" onClick={() => setSettingsOpen(true)}>
            <Settings className="size-5" />
          </Button>
        </div>
      </div>
      <QuizSettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </AppLayout>
  );
}
