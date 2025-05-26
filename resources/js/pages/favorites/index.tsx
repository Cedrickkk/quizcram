import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BookOpen, PlusCircle, Search, Star } from 'lucide-react';
import { useState } from 'react';
import { Subject } from '../subjects/details';

// Define the page props including the favorited subjects
type PageProps = {
  favorites: Subject[];
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Favorites',
    href: '/favorites',
  },
];

export default function Favorites() {
  const { favorites } = usePage<PageProps>().props;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFavorites = favorites?.filter(subject => subject.title.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Favorites" />

      <div className="container p-6">
        {/* Page Header */}
        <div className="mb-6 flex items-center justify-between border-b-2 py-6">
          <h1 className="text-2xl font-semibold">My Favorites</h1>
          <Button asChild>
            <Link href="/subjects">
              <PlusCircle className="mr-2 h-4 w-4" />
              Browse All Subjects
            </Link>
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm">
              {filteredFavorites.length} {filteredFavorites.length === 1 ? 'item' : 'items'}
            </p>
            <Separator orientation="vertical" className="size-4 grow-0 text-black" />
            <div className="relative max-w-md flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search favorites..."
                className="border-none pl-9 shadow-none outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFavorites.map(subject => (
            <Link key={subject.id} href={`/subjects/${subject.id}`}>
              <Card className="overflow-hidden rounded-xs">
                <div className="relative">
                  <div className="h-36 overflow-hidden bg-gray-100">
                    {subject.image ? (
                      <img src={subject.image} alt={subject.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50">
                        <BookOpen className="h-12 w-12 text-slate-300" />
                      </div>
                    )}
                  </div>

                  <div className="absolute top-2 right-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  </div>
                </div>

                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <h3 className="font-medium">{subject.title}</h3>
                    <p className="text-muted-foreground text-sm">{subject.quizzes?.length || 0} Quizzes</p>
                  </div>
                  <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full p-0">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        {favorites.length === 0 && (
          <div className="mt-12 flex flex-col items-center justify-center text-center">
            <Star className="mb-4 h-16 w-16 text-gray-200" />
            <h2 className="mb-2 text-xl font-medium">No favorites yet</h2>
            <p className="mb-6 max-w-md text-gray-500">Add subjects to your favorites for quick access to your most frequent study materials</p>
            <Button asChild>
              <Link href="/subjects">Browse Subjects</Link>
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
