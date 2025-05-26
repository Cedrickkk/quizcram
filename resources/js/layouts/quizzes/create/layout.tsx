import { Button } from '@/components/ui/button';
import { Quiz } from '@/pages/quizzes/show';
import QuizSettingsDialog from '@/pages/quizzes/show-quiz-settings-dialog';
import { Settings } from 'lucide-react';
import { useState } from 'react';

type QuizCreateQuestionLayoutProps = {
  quiz: Quiz;
  children: React.ReactNode;
};

export default function QuizCreateQuestionLayout({ quiz, children }: QuizCreateQuestionLayoutProps) {
  const [showQuizSettingsDialog, setShowQuizSettingsDialog] = useState(false);

  return (
    <div className="container py-6">
      <div className="mb-6 flex items-start justify-between px-6 lg:px-9 lg:py-3">
        <div>
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          <p className="text-muted-foreground text-sm">Subject: {quiz.subject.title}</p>
          <p className="text-muted-foreground text-sm">Last updated: {quiz.created_at}</p>
        </div>
        <Button variant="ghost" onClick={() => setShowQuizSettingsDialog(true)}>
          <Settings className="h-3.5" />
        </Button>
      </div>
      <div className="container px-6">{children}</div>
      <QuizSettingsDialog settings={quiz.settings} open={showQuizSettingsDialog} onOpenChange={setShowQuizSettingsDialog} />
    </div>
  );
}
