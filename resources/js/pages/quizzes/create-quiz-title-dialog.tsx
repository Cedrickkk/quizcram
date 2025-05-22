import LoaderIcon from '@/components/loader-icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

interface CreateQuizTitleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectId: number;
  subjectTitle: string;
}

export default function CreateQuizTitleDialog({ open, onOpenChange, subjectId, subjectTitle }: CreateQuizTitleDialogProps) {
  const { data, setData, post, errors, processing, reset } = useForm({
    title: '',
    subject_id: subjectId,
  });

  const handleSubmit: FormEventHandler = e => {
    e.preventDefault();

    post(route('subjects.quizzes.create-title', { subject: subjectId }), {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        if (!isOpen) reset();
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center">Create New Quiz</DialogTitle>
            <DialogDescription>Create a new quiz for {subjectTitle}</DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="quiz-title">Quiz Title</Label>
                <Input
                  id="quiz-title"
                  name="title"
                  placeholder="Enter quiz title"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                  autoFocus
                />
                {errors.title && <p className="text-destructive text-sm">{errors.title}</p>}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing && <LoaderIcon />} Create Quiz
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
