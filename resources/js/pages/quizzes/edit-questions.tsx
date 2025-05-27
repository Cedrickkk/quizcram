import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { Check, CheckCircle2, CircleDot, Edit, Pencil, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Question, Quiz } from './show';

type PageProps = {
  quiz: Quiz;
};

export default function EditQuestions() {
  const { quiz } = usePage<PageProps>().props;
  const { processing, delete: deleteQuestion } = useForm();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<number | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);

  // Store original questions to restore if editing is canceled
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([]);

  const [questions, setQuestions] = useState<Question[]>(
    quiz.questions.map((question, index) => ({
      ...question,
      type: question.type || 'multiple_choice',
      points: question.points || 1,
      required: question.required ?? true,
      order_number: question.order_number || index + 1,
      time_estimation: question.time_estimation || 0,
      order: question.order || 'keep_choices_in_current_order',
      options: question.options.map((option, index) => ({
        ...option,
        id: option.id || index + 1,
        text: option.text,
        is_correct: option.is_correct,
        question_id: question.id,
        order_number: option.order_number || index + 1,
        created_at: option.created_at || question.created_at,
        updated_at: option.updated_at || question.updated_at,
      })),
    })) || []
  );

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Subjects',
      href: '/subjects',
    },
    {
      title: quiz.subject.title,
      href: `/subjects/${quiz.subject.id}`,
    },
    {
      title: quiz.title,
      href: `/subjects/${quiz.subject.id}/quizzes/${quiz.id}`,
    },
    {
      title: 'Edit Questions',
      href: `/subjects/${quiz.subject.id}/quizzes/${quiz.id}/questions`,
    },
  ];

  const handleEditQuestion = (questionId: number) => {
    setOriginalQuestions(JSON.parse(JSON.stringify(questions)));
    setActiveQuestionId(questionId);
  };

  const handleCancelEdit = () => {
    setActiveQuestionId(null);
    setQuestions(originalQuestions);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateQuestionField = (questionId: number, field: string, value: any) => {
    setQuestions(questions.map(q => (q.id === questionId ? { ...q, [field]: value } : q)));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateOptionField = (questionId: number, optionId: number, field: string, value: any) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          const updatedOptions = q.options.map(opt => (opt.id === optionId ? { ...opt, [field]: value } : opt));
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  const addOption = (questionId: number) => {
    setQuestions(
      questions.map(question => {
        if (question.id === questionId) {
          const newOption = {
            id: Math.max(...question.options.map(option => Number(option.id) || 0)) + 1,
            text: '',
            is_correct: false,
            question_id: questionId,
            order_number: question.options.length + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          return { ...question, options: [...question.options, newOption] };
        }
        return question;
      })
    );
  };

  const removeOption = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId && q.options.length > 2) {
          return {
            ...q,
            options: q.options.filter(opt => opt.id !== optionId),
          };
        }
        return q;
      })
    );
  };

  const saveQuestion = (questionId: number) => {
    const questionToSave = questions.find(q => q.id === questionId);
    if (!questionToSave) return;
    router.patch(
      `/subjects/${quiz.subject_id}/quizzes/${quiz.id}/questions/${questionId}`,
      { question: questionToSave },
      {
        preserveScroll: true,
        onSuccess: () => {
          setActiveQuestionId(null);
          toast(
            <Alert className="border-none p-0 font-sans">
              <AlertTitle className="flex items-center gap-1.5 font-medium text-green-600">
                <Check className="size-4" />
                Question Updated
              </AlertTitle>
              <AlertDescription>The question was updated successfully.</AlertDescription>
            </Alert>
          );
        },
        onError: () => {
          toast(
            <Alert className="text-destructive border-none p-0 font-sans" variant="destructive">
              <AlertTitle className="flex items-center gap-1.5 font-medium">Failed To Update Question</AlertTitle>
              <AlertDescription>There's something wrong.</AlertDescription>
            </Alert>
          );
        },
      }
    );
  };

  const handleCorrectAnswerChange = (questionId: number, optionId: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          const updatedOptions = q.options.map(opt => ({
            ...opt,
            is_correct: opt.id === optionId,
          }));
          return { ...q, options: updatedOptions };
        }
        return q;
      })
    );
  };

  const openDeleteDialog = (questionId: number) => {
    setQuestionToDelete(questionId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (questionToDelete === null) return;

    deleteQuestion(
      route('subjects.quizzes.quiz.questions.delete', {
        subject: quiz.subject_id,
        quiz: quiz.id,
        question: questionToDelete,
      }),
      {
        preserveScroll: true,
        onSuccess: () => {
          setQuestions(questions.filter(q => q.id !== questionToDelete));
          toast.success('Question deleted successfully');
          setIsDeleteDialogOpen(false);
          setQuestionToDelete(null);
        },
        onError: () => {
          toast.error('Failed to delete question');
          setIsDeleteDialogOpen(false);
          setQuestionToDelete(null);
        },
      }
    );
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setQuestionToDelete(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Edit Questions" />

      <div className="container p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Edit Questions</h1>
            <p className="text-muted-foreground text-sm">Quiz: {quiz.title}</p>
          </div>
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/create`}>Add Questions</Link>
            </Button>
            <Button asChild>
              <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}`}>Done</Link>
            </Button>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 rounded-full bg-gray-100 p-3">
              <CheckCircle2 className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="mb-2 text-xl font-medium">No questions yet</h2>
            <p className="mb-6 max-w-sm text-gray-500">This quiz doesn't have any questions yet. Add some questions to get started.</p>
            <Button asChild>
              <Link href={`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/create`}>Add Questions</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {questions.map((question, qIndex) => {
              const isEditing = activeQuestionId === question.id;

              return (
                <Card key={question.id} className="rounded-none border-none shadow-none">
                  <div className="border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-medium">Question {qIndex + 1}</h2>
                      <div className="flex gap-2">
                        {isEditing ? (
                          <>
                            <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                              <X className="h-4 w-4" />
                              <span className="sr-only">Cancel</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => saveQuestion(question.id!)} disabled={processing}>
                              <Save className="h-4 w-4" />
                              <span className="sr-only">Save</span>
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(question.id!)}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => openDeleteDialog(question.id!)}>
                              <Trash2 className="h-4 w-4 text-red-500" />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <CardContent>
                    {/* Question Type and Required Toggle */}
                    <div className="-mx-6 mb-8 flex items-center justify-between bg-gray-50 px-6 py-3">
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <Select
                            value={question.type}
                            onValueChange={value => updateQuestionField(question.id!, 'type', value)}
                            disabled={isEditing}
                          >
                            <SelectTrigger>
                              <div className="flex items-center">
                                {question.type === 'multiple_choice' && (
                                  <span className="mr-2">
                                    <CircleDot className="h-4 w-4" />
                                  </span>
                                )}
                                {question.type === 'true_or_false' && (
                                  <span className="mr-2">
                                    <CircleDot className="h-4 w-4" />
                                  </span>
                                )}
                                {question.type === 'short_answer' && (
                                  <span className="mr-2">
                                    <Pencil className="h-4 w-4" />
                                  </span>
                                )}
                                <SelectValue placeholder="Question Type" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                              <SelectItem value="true_or_false">True or False</SelectItem>
                              <SelectItem value="short_answer">Short Answer</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <button
                            disabled
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring flex h-10 items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span className="flex items-center gap-4">
                              <CircleDot className="h-4 w-4" />
                              {question.type === 'multiple_choice'
                                ? 'Multiple Choice'
                                : question.type === 'true_or_false'
                                  ? 'True or False'
                                  : 'Multiple Choice'}
                            </span>
                            <span>▾</span>
                          </button>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Required</span>
                        <Switch
                          checked={question.required}
                          disabled={!isEditing}
                          onCheckedChange={checked => updateQuestionField(question.id!, 'required', checked)}
                        />
                      </div>
                    </div>

                    {/* Question Text */}
                    <div className="mb-8">
                      <Input
                        value={question.text}
                        disabled={!isEditing}
                        onChange={e => updateQuestionField(question.id!, 'text', e.target.value)}
                        className="h-auto border-none p-0 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        placeholder="Question text"
                      />
                    </div>

                    {/* Choices */}
                    <div className="mb-8 space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-red-500">Choices *</Label>
                      </div>
                      <div className="space-y-4">
                        {question.options.map((option, optIndex) => (
                          <div key={option.id} className="flex items-center gap-3">
                            <input
                              type="radio"
                              className="size-4 rounded-full border border-gray-300 disabled:opacity-60"
                              checked={option.is_correct}
                              disabled={!isEditing}
                              onChange={() => isEditing && handleCorrectAnswerChange(question.id!, option.id!)}
                            />
                            <Input
                              value={option.text}
                              disabled={!isEditing}
                              onChange={e => updateOptionField(question.id!, option.id!, 'text', e.target.value)}
                              className="flex-1"
                              placeholder={`Choice ${optIndex + 1}`}
                            />
                            {isEditing && question.options.length > 2 && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeOption(question.id!, option.id!)}
                                className="h-8 w-8 rounded-full p-0 text-red-400"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                      {isEditing && (
                        <Button variant="outline" className="mt-4" onClick={() => addOption(question.id!)}>
                          Add answers
                        </Button>
                      )}
                    </div>

                    {/* Bottom settings */}
                    <div className="mt-8 grid grid-cols-1 gap-4 border-t pt-4 md:grid-cols-3">
                      <div>
                        <Label>Randomize Order</Label>
                        {isEditing ? (
                          <Select value={question.order} onValueChange={value => updateQuestionField(question.id!, 'order', value)}>
                            <SelectTrigger className="mt-2">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="keep_choices_in_current_order">Keep choices in current order</SelectItem>
                              <SelectItem value="randomize">Randomize answers</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <button
                            disabled
                            className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus:ring-ring mt-2 flex h-10 w-full items-center justify-between rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <span>{question.order === 'randomize' ? 'Randomize answers' : 'Keep choices in current order'}</span>
                            <span>▾</span>
                          </button>
                        )}
                      </div>

                      <div>
                        <Label>Estimation Time</Label>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type="number"
                            min="0"
                            value={question.time_estimation}
                            disabled={!isEditing}
                            onChange={e => updateQuestionField(question.id!, 'time_estimation', parseInt(e.target.value))}
                            className="w-20"
                          />
                          <span>Mins</span>
                        </div>
                      </div>

                      <div>
                        <Label>Mark as point</Label>
                        <div className="mt-2 flex items-center gap-2">
                          <Input
                            type="number"
                            min={1}
                            className="w-16"
                            value={question.points}
                            disabled={!isEditing}
                            onChange={e => updateQuestionField(question.id!, 'points', parseInt(e.target.value))}
                          />
                          <Badge className="ml-2 bg-amber-500 text-white">Points</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Bottom action buttons when editing */}
                    {isEditing && (
                      <div className="mt-6 flex justify-end gap-2 border-t pt-4">
                        <Button variant="outline" onClick={handleCancelEdit}>
                          Cancel
                        </Button>
                        <Button onClick={() => saveQuestion(question.id!)} disabled={processing}>
                          Save Changes
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Alert Dialog for Question Deletion */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Question</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete this question? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 text-white hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
