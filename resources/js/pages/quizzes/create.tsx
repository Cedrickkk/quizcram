import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import QuizCreateQuestionLayout from '@/layouts/quizzes/create/layout';
import { BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { AlertCircle, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import CreateQuestionForm from './create-question-form';
import { QuestionType, Quiz } from './show';
import QuizSettingsDialog from './show-quiz-settings-dialog';

type Choice = {
  id: number;
  text: string;
  question_id: number;
  is_correct: boolean;
  order_number: number;
};

type NewQuestion = {
  text: string;
  type: QuestionType;
  choices: Choice[];
  points: number;
  order: 'keep_choices_in_current_order' | 'randomize';
  required: boolean;
  order_number: number;
  time_estimation: number;
  image?: File | null;
};

type QuestionsFormData = {
  questions: NewQuestion[];
};

type PageProps = {
  quiz: Quiz;
};

export default function Create() {
  const { quiz } = usePage<PageProps>().props;
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
      title: 'New Questions',
      href: `/subjects/${quiz.subject.id}/quizzes/${quiz.id}`,
    },
  ];
  const [currentQuestion, setCurrentQuestion] = useState<NewQuestion>({
    text: '',
    image: null,
    type: 'multiple_choice',
    points: 1,
    required: true,
    order_number: 1,
    time_estimation: 0,
    order: 'keep_choices_in_current_order',
    choices: [
      { id: 1, text: '', is_correct: true, order_number: 1, question_id: 1 },
      { id: 2, text: '', is_correct: false, order_number: 2, question_id: 1 },
      { id: 3, text: '', is_correct: false, order_number: 3, question_id: 1 },
      { id: 4, text: '', is_correct: false, order_number: 4, question_id: 1 },
    ],
  });
  const [questions, setQuestions] = useState<NewQuestion[]>([]);
  const [showQuizSettingsDialog, setShowQuizSettingsDialog] = useState(false);

  const { setData, post, processing } = useForm<QuestionsFormData>({
    questions: [],
  });

  const handleSaveAndAddAnother = () => {
    if (!currentQuestion.text.trim()) {
      toast(
        <Alert className="border-amber-500 bg-[#FEF3C7] font-sans outline-none">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Question Text Required</AlertTitle>
          <AlertDescription>Please enter a question text before saving.</AlertDescription>
        </Alert>,
        {
          duration: 4000,
          style: {
            padding: 0,
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          },
        }
      );
      return;
    }

    if (currentQuestion.type === 'multiple_choice' && currentQuestion.choices.some(c => !c.text.trim())) {
      toast(
        <Alert className="border-amber-500 bg-[#FEF3C7] font-sans outline-none">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Incomplete Choices</AlertTitle>
          <AlertDescription> All multiple choice options must have text.</AlertDescription>
        </Alert>,
        {
          duration: 4000,
          style: {
            padding: 0,
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          },
        }
      );
      return;
    }

    if (currentQuestion.type === 'short_answer' && !currentQuestion.choices[0]?.text?.trim()) {
      toast(
        <Alert className="border-amber-500 bg-[#FEF3C7] font-sans outline-none">
          <AlertCircle className="h-4 w-4 text-amber-500" />
          <AlertTitle>Missing Answer</AlertTitle>
          <AlertDescription> Please provide a correct answer for the short answer question.</AlertDescription>
        </Alert>,
        {
          duration: 4000,
          style: {
            padding: 0,
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
          },
        }
      );
      return;
    }

    const updatedQuestions = [...questions, currentQuestion];
    setQuestions(updatedQuestions);
    setData('questions', updatedQuestions);

    const nextOrderNumber = currentQuestion.order_number + 1;

    const newQuestion: NewQuestion = {
      text: '',
      image: null,
      type: 'multiple_choice',
      points: 1,
      required: true,
      order_number: nextOrderNumber,
      time_estimation: 0,
      order: 'keep_choices_in_current_order',
      choices: [
        { id: 1, text: '', is_correct: true, order_number: 1, question_id: nextOrderNumber },
        { id: 2, text: '', is_correct: false, order_number: 2, question_id: nextOrderNumber },
        { id: 3, text: '', is_correct: false, order_number: 3, question_id: nextOrderNumber },
        { id: 4, text: '', is_correct: false, order_number: 4, question_id: nextOrderNumber },
      ],
    };

    setCurrentQuestion(newQuestion);
  };

  const handleSubmitAll = () => {
    let allQuestions = [...questions];
    if (currentQuestion.text.trim()) {
      allQuestions = [...questions, currentQuestion];
    }

    setData('questions', allQuestions);
    post(`/subjects/${quiz.subject_id}/quizzes/${quiz.id}/questions`);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Create Quiz" />
      <QuizCreateQuestionLayout quiz={quiz}>
        <div className="relative container py-6">
          <div className="container py-6">
            {questions.map((question, index) => (
              <div key={index} className="mb-8">
                <div className="mb-2 flex items-center justify-between">
                  <h2 className="text-lg font-medium">Question {quiz.questions.length}</h2>
                  <Button
                    variant="ghost"
                    color="destructive"
                    size="icon"
                    onClick={() => {
                      const updatedQuestions = [...questions];
                      updatedQuestions.splice(index, 1);
                      setQuestions(updatedQuestions);
                      setData('questions', updatedQuestions);
                    }}
                  >
                    <Trash2 className="text-destructive" />
                  </Button>
                </div>

                <CreateQuestionForm
                  question={question}
                  onQuestionChange={updatedQuestion => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index] = updatedQuestion;
                    setQuestions(updatedQuestions);
                    setData('questions', updatedQuestions);
                  }}
                  onSave={() => {}}
                  saveButtonText="Update Question"
                  hideSaveButton={true}
                />
              </div>
            ))}

            {/* Current new question form */}
            <div className="mb-8">
              <h2 className="mb-3 text-lg font-medium">Question {quiz.questions.length + 1}</h2>
              <CreateQuestionForm
                question={currentQuestion}
                onQuestionChange={setCurrentQuestion}
                onSave={handleSaveAndAddAnother}
                saveButtonText="Add Question"
              />
            </div>

            <div className="mt-8 flex justify-between">
              <div>
                {questions.length > 0 && (
                  <div className="text-sm text-gray-600">
                    {questions.length} question{questions.length !== 1 ? 's' : ''} ready to save
                  </div>
                )}
              </div>
              <Button
                onClick={handleSubmitAll}
                disabled={processing || (questions.length === 0 && !currentQuestion.text.trim())}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {processing ? 'Saving...' : 'Save All Questions'}
              </Button>
            </div>
          </div>
        </div>
        <QuizSettingsDialog settings={quiz.settings} open={showQuizSettingsDialog} onOpenChange={setShowQuizSettingsDialog} />
      </QuizCreateQuestionLayout>
    </AppLayout>
  );
}
