import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Subject } from '@/pages/subjects/index';
import { useForm } from '@inertiajs/react';
import { Archive } from 'lucide-react';
import { useState } from 'react';

interface ArchiveSubjectDialogProps {
  subject: Subject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ArchiveSubjectDialog({ subject, open, onOpenChange }: ArchiveSubjectDialogProps) {
  const [charactersCount, setCharactersCount] = useState(0);

  const { data, setData, post, processing, errors, reset } = useForm({
    reason: '',
    subject,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(`subjects/${subject?.id}/archive`, {
      onSuccess: () => {
        onOpenChange(false);
        reset();
      },
      showProgress: false,
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Archive className="h-5 w-5 text-amber-500" />
            Archive Subject
          </DialogTitle>
          <DialogDescription>
            You are about to archive "<span className="font-medium">{subject?.title}</span>". Archived subjects will be hidden from your main subjects
            list.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Reason for archiving</h3>
            <Textarea
              value={data.reason}
              onChange={e => {
                setData('reason', e.target.value);
                setCharactersCount(e.target.value.length);
              }}
              placeholder="Enter the reason why you want to archive this subject"
              className="resize-none"
              maxLength={150}
              rows={4}
            />
            <div className="flex justify-end">
              <span className="text-muted-foreground text-xs">{charactersCount}/150</span>
            </div>
            {errors.reason && <p className="text-destructive text-sm">{errors.reason}</p>}
          </div>

          <div className="space-y-2">
            <h3 className="text-sm font-medium">What happens when you archive?</h3>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5 text-sm">
              <li>The subject will be moved to your Archive folder</li>
              <li>All quizzes in this subject will also be archived</li>
              <li>You can restore this subject at any time from the Archive</li>
            </ul>
          </div>

          <DialogFooter className="gap-3 sm:gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={processing} className="bg-amber-600 hover:bg-amber-700">
              Archive Subject
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
