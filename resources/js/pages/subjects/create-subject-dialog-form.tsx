import LoaderIcon from '@/components/loader-icon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { Upload } from 'lucide-react';
import { FormEvent, useState } from 'react';

interface CreateSubjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateSubjectDialog({ open, onOpenChange }: CreateSubjectDialogProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data, setData, post, processing, errors, reset } = useForm({
    title: '',
    description: '',
    image: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setData('image', file);
      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post(route('subjects.store'), {
      onSuccess: () => {
        onOpenChange(false);
        reset();
        setImagePreview(null);
      },
      showProgress: false,
    });
  };

  const handleCancel = () => {
    onOpenChange(false);
    reset();
    setImagePreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <DialogHeader>
          <DialogDescription className="sr-only">Create Subject</DialogDescription>
          <DialogTitle className="text-xl font-bold">Create Subject</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <Input type="file" id="subject-image" className="sr-only" accept="image/*" onChange={handleImageChange} />
            <Label
              htmlFor="subject-image"
              className="flex h-56 w-full cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-100 hover:bg-gray-50"
            >
              {imagePreview ? (
                <img src={imagePreview} alt="Subject preview" className="h-full w-full rounded-md object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center space-y-2 py-4">
                  <Upload className="h-10 w-10 text-gray-400" />
                  <p className="text-sm text-gray-500">Click to upload subject image</p>
                </div>
              )}
            </Label>
            {errors.image && <p className="text-destructive mt-1 text-sm">{errors.image}</p>}
          </div>

          <div>
            <Label htmlFor="subject-title" className="text-base font-medium">
              Subject
            </Label>
            <Input
              id="subject-title"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
              placeholder="Enter subject title"
              className="mt-1"
            />
            {errors.title && <p className="text-destructive mt-1 text-sm">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="subject-description" className="text-sm">
              Description
            </Label>
            <Textarea
              id="subject-description"
              value={data.description}
              onChange={e => setData('description', e.target.value)}
              placeholder="Type description here"
              className="mt-1 w-full resize-none"
              rows={4}
            />
            {errors.description && <p className="text-destructive mt-1 text-sm">{errors.description}</p>}
          </div>

          <div className="flex justify-end">
            <span className="text-xs text-gray-500">{data.description?.length || 0}/300</span>
          </div>

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {processing && <LoaderIcon />} Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
