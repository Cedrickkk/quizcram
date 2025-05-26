import AppLayout from '@/layouts/app-layout';
import SubjectLayout from '@/layouts/subjects/layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Activity, BookOpen, Clock, Coins } from 'lucide-react';

export interface Quiz {
  id: number;
  title: string;
  total_questions: number;
  time_duration: number | null;
  created_at: string;
  updated_at: string;
}

export interface Subject {
  id: number;
  title: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  is_favorited: boolean;
  quizzes: Quiz[];
  total_quizzes: number;
  avg_duration: number;
  avg_accuracy: number;
  total_points: number;
}

export default function Details() {
  const { subject } = usePage<{ subject: Subject }>().props;
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Subjects',
      href: '/subjects',
    },
    {
      title: subject.title,
      href: `/subjects/${subject.id}`,
    },
  ];
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="DETAILS" />
      <SubjectLayout subject={subject}>
        <div className="grid grid-cols-1 gap-6 pt-6 md:grid-cols-3">
          <div className="md:col-span-3">
            {/* Subject statistics */}
            <div className="mb-8 grid grid-cols-2 gap-1 sm:grid-cols-1">
              <div className="flex items-center gap-2">
                <div className="rounded-full bg-blue-50 p-2">
                  <BookOpen className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-sm">{subject.total_quizzes} quizzes</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-amber-50 p-2">
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <p className="text-sm">{subject.avg_duration} average time</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-green-50 p-2">
                  <Activity className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-sm">{subject.avg_accuracy || 0}% accuracy</p>
              </div>

              <div className="flex items-center gap-2">
                <div className="rounded-full bg-purple-50 p-2">
                  <Coins className="h-4 w-4 text-purple-500" />
                </div>
                <p className="text-sm">{subject.total_points} total points</p>
              </div>
            </div>

            {/* Subject image */}
            {subject.image && (
              <div className="mb-8">
                <img src={subject.image} alt={subject.title} className="h-96 w-full rounded-lg object-cover" />
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="mb-4 text-xl font-semibold">Description</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-gray-700">{subject.description}</p>
              </div>
            </div>
          </div>
        </div>
      </SubjectLayout>
    </AppLayout>
  );
}
