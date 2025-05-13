import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import CreateSubjectDialog from '@/pages/subjects/create-subject-dialog-form';
import { PaginatedData, type BreadcrumbItem } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowUpDown, BookOpen, Grid2x2, List, MoreVertical, PlusCircle, Search } from 'lucide-react';
import { useState } from 'react';
import ArchiveSubjectDialog from './archive-subject-dialog-form';

export type Subject = {
  id: number;
  title: string;
  description: string;
  image: string;
  created_at: string;
  updated_at: string;
};

type PageProps = {
  subjects: PaginatedData<Subject>;
};

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Subjects',
    href: '/subjects',
  },
];

export default function Subjects() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isArchiveDialogOpen, setIsArchiveDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const { subjects } = usePage<PageProps>().props;

  const filteredSubjects = subjects.data.filter(subject => subject.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleArchiveClick = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsArchiveDialogOpen(true);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Subjects" />

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="flex-1 px-6">
          <div className="mb-6 flex items-center justify-between border-b-2 py-6">
            <h1 className="text-2xl font-semibold">Subjects</h1>
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Subject
            </Button>
          </div>

          <div className="mb-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-sm text-black">
                {filteredSubjects.length} {filteredSubjects.length === 1 ? 'item' : 'items'}
              </p>
              <Separator orientation="vertical" className="size-4 grow-0 text-black" />
              <div className="relative max-w-md flex-1">
                <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search..."
                  className="border-none pl-9 shadow-none outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <Button variant="ghost" className="ml-4 gap-2" size="sm">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Date Created</span>
              </Button>

              <TooltipProvider>
                <div className="flex items-center gap-1">
                  <Tooltip delayDuration={1000}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Grid2x2 className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Card layout</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip delayDuration={1000}>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <List className="h-3.5 w-3.5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>List layout</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredSubjects.map(subject => (
              <Card key={subject.id} className="overflow-hidden rounded-sm">
                <div className="relative">
                  <img src={subject.image} alt={subject.title} className="h-40 w-full bg-no-repeat object-cover" />
                  <div className="absolute top-0 right-0 p-1.5">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" asChild>
                          <DropdownMenuItem onSelect={() => handleArchiveClick(subject)}>Archive</DropdownMenuItem>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <h3 className="text-lg font-semibold">
                    <Link href={`/subjects/${subject.id}`} className="hover:underline">
                      {subject.title}
                    </Link>
                  </h3>
                </CardHeader>

                <CardFooter className="flex items-center justify-between pt-0">
                  <div className="text-sm text-gray-500">Edited {subject.updated_at}</div>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-gray-500" />
                    <span className="text-sm">{subject.id} Quizzes</span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <CreateSubjectDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
      <ArchiveSubjectDialog subject={selectedSubject} open={isArchiveDialogOpen} onOpenChange={setIsArchiveDialogOpen} />
    </AppLayout>
  );
}
