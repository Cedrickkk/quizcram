import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Activity, BookOpen, Clock, Coins, FileText, PlusCircle, Star } from 'lucide-react';
import { useState } from 'react';

interface Quiz {
  id: number;
  title: string;
  total_questions: number;
  time_duration: number | null;
  created_at: string;
  updated_at: string;
}

interface Subject {
  id: number;
  title: string;
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
  quizzes: Quiz[];
  total_quizzes: number;
  avg_duration: number;
  avg_accuracy: number;
  total_points: number;
}

export default function Show() {
  const { subject } = usePage<{ subject: Subject }>().props;
  const [activeTab, setActiveTab] = useState('details');
  const [favorited, setFavorited] = useState(false);

  console.log(subject);

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
      <Head title={`${subject.title} | QuizCram`} />

      <div className="flex-1 px-6">
        <div className="flex flex-col justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">{subject.title}</h1>
            <p className="text-gray-500">Created {subject.created_at}</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="">
          <TabsList className="flex h-auto w-full justify-between rounded-none bg-transparent p-0">
            <div>
              <TabsTrigger
                value="details"
                className="border-b-2 border-transparent px-4 pt-1 pb-2 font-medium text-gray-600 data-[state=active]:border-b-black data-[state=active]:font-semibold data-[state=active]:text-gray-900 data-[state=active]:shadow-none"
              >
                Details Content
              </TabsTrigger>
              <TabsTrigger
                value="quizzes"
                className="border-b-2 border-transparent px-4 pt-1 pb-2 font-medium text-gray-600 data-[state=active]:border-b-black data-[state=active]:font-semibold data-[state=active]:text-gray-900 data-[state=active]:shadow-none"
              >
                Quizzes
              </TabsTrigger>
            </div>
            <Button variant="ghost" className="flex w-fit items-center gap-2" onClick={() => setFavorited(!favorited)}>
              <Star className={`h-4 w-4 ${favorited ? 'fill-yellow-400 text-yellow-400' : ''}`} />
              {favorited ? 'Favorited' : 'Favorite'}
            </Button>
          </TabsList>

          <TabsContent value="details" className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          </TabsContent>

          <TabsContent value="quizzes" className="pt-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Quizzes ({subject.quizzes.length})</h2>
              <Button asChild>
                <Link href={route('subjects.index', { subject_id: subject.id })}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Quiz
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {subject.quizzes.map(quiz => (
                <Card key={quiz.id} className="rounded-none bg-white py-4">
                  <CardContent className="p-0">
                    <Link href={route('subjects.show', { id: quiz.id })} className="flex items-center p-4 transition-colors hover:bg-gray-50">
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

              {subject.quizzes.length === 0 && (
                <div className="py-12 text-center">
                  <FileText className="mx-auto mb-4 h-12 w-12 text-gray-300" />
                  <h3 className="mb-1 text-lg font-medium text-gray-900">No quizzes yet</h3>
                  <p className="mb-6 text-gray-500">Get started by creating your first quiz</p>
                  <Button asChild>
                    <Link href={route('quizzes.create', { subject_id: subject.id })}>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Quiz
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
