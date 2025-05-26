import { Button } from '@/components/ui/button';
import { Subject } from '@/pages/subjects/details';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Star } from 'lucide-react';

type LayoutProps = {
  subject: Subject;
  children: React.ReactNode;
};

export default function SubjectLayout({ children, subject }: LayoutProps) {
  const { url } = usePage();

  const { post, processing } = useForm({
    subject_id: subject.id,
  });

  const isQuizzesActive = url.includes(`/subjects/${subject.id}/quizzes`);
  const isDetailsActive = !isQuizzesActive && url.includes(`/subjects/${subject.id}`);

  const toggleFavorite = () => {
    post(route('favorite.toggle', subject.id), {
      preserveScroll: true,
      showProgress: false,
    });
  };

  return (
    <div className="flex-1 px-6">
      <div className="flex flex-col justify-between gap-4 py-6 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">{subject.title}</h1>
          <p className="text-sm text-gray-500">Created {subject.created_at}</p>
        </div>
      </div>

      <div className="flex h-auto w-full justify-between rounded-none bg-transparent p-0">
        <div>
          <Button
            variant="ghost"
            className={`px-4 pt-1 pb-2 font-medium text-gray-600 ${
              isDetailsActive ? 'border-b-2 border-b-black font-semibold text-gray-900' : 'border-transparent hover:border-b-0'
            }`}
            asChild
          >
            <Link href={`/subjects/${subject.id}`} prefetch>
              Details Content
            </Link>
          </Button>
          <Button
            variant="ghost"
            className={`px-4 pt-1 pb-2 font-medium text-gray-600 ${
              isQuizzesActive ? 'border-b-2 border-b-black font-semibold text-gray-900' : 'border-transparent hover:border-b-0'
            }`}
            asChild
          >
            <Link href={route('subjects.subject.quizzes', subject.id)} prefetch>
              Quizzes
            </Link>
          </Button>
        </div>
        <Button variant="ghost" className="flex w-fit items-center gap-2" onClick={toggleFavorite} disabled={processing}>
          <Star className={`h-4 w-4 ${subject.is_favorited ? 'fill-yellow-400 text-yellow-400' : ''}`} />
          {subject.is_favorited ? 'Favorited' : 'Favorite'}
        </Button>
      </div>
      <div>{children}</div>
    </div>
  );
}
