import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { CheckCircle2, Edit, Save, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateQuestionForm from './create-question-form';
import { QuestionType, Quiz } from './show';

type PageProps = {
  quiz: Quiz;
};

type QuestionOption = {
  id?: number;
  text: string;
  is_correct: boolean;
  orderNumber: number;
};

type Question = {
  id?: number;
  quiz_id: number;
  text: string;
  explanation?: string;
  options: QuestionOption[];
  type: QuestionType;
  points: number;
  required: boolean;
  orderNumber: number;
  timeEstimation: number;
  randomizeOrder?: boolean;
};

export default function EditQuestions() {
  const { quiz } = usePage<PageProps>().props;
  const [activeQuestionId, setActiveQuestionId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Question[]>(
    quiz.questions.map((q, index) => ({
      ...q,
      type: q.type || 'multiple_choice',
      points: q.points || 1,
      required: q.required ?? true,
      orderNumber: q.orderNumber || index + 1,
      timeEstimation: q.timeEstimation || 1,
      randomizeOrder: q.randomizeOrder || false,
      // Map options to choices format
      options: q.options.map((opt, i) => ({
        id: opt.id || i + 1,
        text: opt.text,
        is_correct: opt.is_correct,
        orderNumber: opt.orderNumber || i + 1,
      })),
    })) || []
  );
  const { post, processing } = useForm();

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

  // Start editing a question
  const handleEditQuestion = (questionId: number) => {
    setActiveQuestionId(questionId);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setActiveQuestionId(null);
    // Reset any unsaved changes
    setQuestions(
      quiz.questions.map((q, index) => ({
        ...q,
        type: q.type || 'multiple_choice',
        points: q.points || 1,
        required: q.required ?? true,
        orderNumber: q.orderNumber || index + 1,
        timeEstimation: q.timeEstimation || 1,
        randomizeOrder: q.randomizeOrder || false,
        options: q.options.map((opt, i) => ({
          id: opt.id || i + 1,
          text: opt.text,
          is_correct: opt.is_correct,
          orderNumber: opt.orderNumber || i + 1,
        })),
      }))
    );
  };

  // Update the question when it changes in the CreateQuestionForm
  const handleQuestionChange = (updatedQuestion: any, questionId: number) => {
    setQuestions(
      questions.map(q => {
        if (q.id === questionId) {
          return {
            ...q,
            ...updatedQuestion,
            // Map form choices back to options format
            options: updatedQuestion.choices.map((choice: any) => ({
              id: choice.id,
              text: choice.text,
              is_correct: choice.isCorrect,
              orderNumber: choice.orderNumber,
            })),
          };
        }
        return q;
      })
    );
  };

  const saveQuestion = (questionId: number) => {
    const questionToSave = questions.find(q => q.id === questionId);
    if (!questionToSave) return;

    post(
      route('subjects.quizzes.quiz.questions.update', {
        subject: quiz.subject_id,
        quiz: quiz.id,
        question: questionId,
      }),
      {
        question: questionToSave,
        preserveScroll: true,
        onSuccess: () => {
          setActiveQuestionId(null);
          toast.success('Question updated successfully');
        },
        onError: () => {
          toast.error('Failed to update question');
        },
      }
    );
  };

  const deleteQuestion = (questionId: number) => {
    if (confirm('Are you sure you want to delete this question?')) {
      post(
        route('subjects.quizzes.quiz.questions.delete', {
          subject: quiz.subject_id,
          quiz: quiz.id,
          question: questionId,
        }),
        {
          preserveScroll: true,
          onSuccess: () => {
            setQuestions(questions.filter(q => q.id !== questionId));
            toast.success('Question deleted successfully');
          },
          onError: () => {
            toast.error('Failed to delete question');
          },
        }
      );
    }
  };

  // Helper to transform the question for CreateQuestionForm
  const transformQuestionForForm = (question: Question) => {
    return {
      ...question,
      choices: question.options.map(option => ({
        id: option.id || 0,
        text: option.text,
        isCorrect: option.is_correct,
        orderNumber: option.orderNumber || 0,
        questionId: question.id || 0,
      })),
    };
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
            {questions.map((question, qIndex) => (
              <Card key={question.id} className={activeQuestionId === question.id ? 'border-primary shadow-md' : ''}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-0">
                  <CardTitle className="text-base font-medium">Question {qIndex + 1}</CardTitle>
                  <div className="flex gap-2">
                    {activeQuestionId === question.id ? (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleCancelEdit()}>
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
                        <Button variant="ghost" size="sm" onClick={() => deleteQuestion(question.id!)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </>
                    )}
                  </div>
                </CardHeader>

                {/* Use the CreateQuestionForm component with disabled state */}
                <CreateQuestionForm
                  question={transformQuestionForForm(question)}
                  onQuestionChange={updatedQuestion => activeQuestionId === question.id && handleQuestionChange(updatedQuestion, question.id!)}
                  onSave={() => saveQuestion(question.id!)}
                  onCancel={handleCancelEdit}
                  showCancelButton={activeQuestionId === question.id}
                  hideSaveButton={activeQuestionId !== question.id}
                  saveButtonText="Update Question"
                />
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
