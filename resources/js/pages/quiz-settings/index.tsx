import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { BarChart4, Check, Clock, Settings2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Quiz Settings',
    href: '/quiz-settings',
  },
];

export type SystemSettings = {
  id?: number;
  name: string;
  use_default_settings: boolean;
  question_order: 'sequential' | 'random';
  display_format: 'one_per_page' | 'all_on_page';
  show_question_number: boolean;
  visible_timer: boolean;
  question_required: boolean;
  show_correct_answers: 'immediately' | 'after_quiz';
  passing_threshold: number;
  time_duration: number;
  max_attempts: number | null;
};

export default function QuizSettings() {
  const { settings } = usePage<{ settings: SystemSettings }>().props;

  const { data, setData, post, put, processing, errors } = useForm<SystemSettings>({
    id: settings.id,
    use_default_settings: true,
    name: settings.name || 'Default Quiz Settings',
    question_order: settings.question_order || 'sequential',
    display_format: settings.display_format || 'one_per_page',
    show_question_number: settings.show_question_number ?? true,
    visible_timer: settings.visible_timer ?? true,
    question_required: settings.question_required ?? true,
    show_correct_answers: settings.show_correct_answers || 'after_quiz',
    passing_threshold: settings.passing_threshold || 70,
    time_duration: settings.time_duration || 900,
    max_attempts: settings.max_attempts || null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.id) {
      put(`/quiz-settings/${data.id}`);
    } else {
      post('/quiz-settings');
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Quiz Settings" />

      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Quiz Settings</h1>
          <p className="text-muted-foreground">
            Customize quiz parameters to match your educational goals and create an effective testing experience.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-10">
            {/* Global Settings Switch */}
            <div className="border-b pb-4">
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-lg font-medium">Default Settings</h2>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="use_default_settings"
                    checked={data.use_default_settings}
                    onCheckedChange={checked => setData('use_default_settings', checked)}
                  />
                  <Label htmlFor="use_default_settings">Use default settings</Label>
                </div>
              </div>
              <p className="text-muted-foreground text-sm">
                When enabled, all quizzes will use these default settings unless overridden individually.
              </p>
            </div>

            {/* Question Presentation */}
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center text-lg font-medium">
                  <Settings2 className="mr-2 h-5 w-5" />
                  Question Presentation
                </h2>
                <p className="text-muted-foreground text-sm">
                  Customize how questions appear to quiz takers, including order and visibility options.
                </p>
              </div>

              <div className="space-y-6 pl-2">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="question_order">Question Order</Label>
                  <Select
                    disabled={data.use_default_settings}
                    value={data.question_order || 'sequential'}
                    onValueChange={value => setData('question_order', value as 'sequential' | 'random')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequential">Sequential</SelectItem>
                      <SelectItem value="random">Random</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="display_format">Display Format</Label>
                  <Select
                    disabled={data.use_default_settings}
                    value={data.display_format || 'one_per_page'}
                    onValueChange={value => setData('display_format', value as 'one_per_page' | 'all_on_page')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one_per_page">One question per page</SelectItem>
                      <SelectItem value="all_on_page">All questions on one page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="show_question_number">Show Question Numbers</Label>
                  <Switch
                    id="show_question_number"
                    disabled={data.use_default_settings}
                    checked={data.show_question_number || false}
                    onCheckedChange={checked => setData('show_question_number', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="question_required">Make Questions Required</Label>
                  <Switch
                    id="question_required"
                    disabled={data.use_default_settings}
                    checked={data.question_required || false}
                    onCheckedChange={checked => setData('question_required', checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Time Management */}
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center text-lg font-medium">
                  <Clock className="mr-2 h-5 w-5" />
                  Time Management
                </h2>
                <p className="text-muted-foreground text-sm">
                  Customize time limits and how time information is displayed during the quiz experience.
                </p>
              </div>

              <div className="space-y-4 pl-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="visible_timer">Visible Timer</Label>
                  <Switch
                    id="visible_timer"
                    disabled={data.use_default_settings}
                    checked={data.visible_timer || false}
                    onCheckedChange={checked => setData('visible_timer', checked)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Answer Options */}
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center text-lg font-medium">
                  <Check className="mr-2 h-5 w-5" />
                  Answer Options
                </h2>
                <p className="text-muted-foreground text-sm">Set parameters for when to submit and review your answers.</p>
              </div>

              <div className="space-y-4 pl-2">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="show_correct_answers">Show Correct Answers</Label>
                  <Select
                    disabled={data.use_default_settings}
                    value={data.show_correct_answers || 'immediately'}
                    onValueChange={value => setData('show_correct_answers', value as 'immediately' | 'after_quiz')}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select when to show answers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately after answering</SelectItem>
                      <SelectItem value="after_quiz">After completing the quiz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Scoring & Feedback */}
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center text-lg font-medium">
                  <BarChart4 className="mr-2 h-5 w-5" />
                  Scoring & Feedback
                </h2>
                <p className="text-muted-foreground text-sm">Define how quizzes are scored and what feedback are receive after completion.</p>
              </div>

              <div className="space-y-4 pl-2">
                <div className="grid w-full items-center gap-2">
                  <Label htmlFor="passing_threshold">Passing Threshold (%)</Label>
                  <div className="flex items-center">
                    <Input
                      id="passing_threshold"
                      type="number"
                      min="0"
                      max="100"
                      disabled={data.use_default_settings}
                      value={data.passing_threshold || ''}
                      onChange={e => setData('passing_threshold', parseInt(e.target.value))}
                    />
                    <span className="ml-2">%</span>
                  </div>
                  {errors.passing_threshold && <p className="text-destructive text-sm">{errors.passing_threshold}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 border-t pt-4">
              <Button type="button" variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={processing}>
                Save Settings
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
