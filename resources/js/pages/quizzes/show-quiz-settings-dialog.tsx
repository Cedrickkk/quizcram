import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { BarChart4, Check, Clock, Settings2 } from 'lucide-react';
import { useState } from 'react';

export type SystemSettings = {
  question_order: 'sequential' | 'random';
  display_format: 'one_per_page' | 'all_on_page';
  show_question_number: boolean;
  visible_timer: boolean;
  question_required: boolean;
  show_correct_answers: 'immediately' | 'after_quiz';
  passing_threshold: number;
  default_time_duration: number;
  default_max_attempts: number | null;
};

export type QuizSettings = {
  use_default_settings: boolean;
  question_order: 'sequential' | 'random' | null;
  display_format: 'one_per_page' | 'all_on_page' | null;
  show_question_number: boolean | null;
  visible_timer: boolean | null;
  question_required: boolean | null;
  show_correct_answers: 'immediately' | 'after_quiz' | null;
  passing_threshold: number | null;
};

interface QuizSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function QuizSettingsDialog({ open, onOpenChange }: QuizSettingsDialogProps) {
  const [useDefaultSettings, setUseDefaultSettings] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90dvh] overflow-y-auto sm:max-w-lg md:max-w-2xl lg:max-w-4xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center">
            <Settings2 className="mr-2 h-5 w-5" /> Quiz Settings
          </DialogTitle>
          <DialogDescription>Configure how this quiz will be presented to students</DialogDescription>
        </DialogHeader>

        {/* Global Settings Switch */}
        <div className="border-b pb-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-medium">Default Settings</h2>
            <div className="flex items-center space-x-2">
              <Switch id="use_default_settings" checked={useDefaultSettings} onCheckedChange={setUseDefaultSettings} />
              <Label htmlFor="use_default_settings">Use default settings</Label>
            </div>
          </div>
          <p className="text-muted-foreground text-sm">
            When enabled, this quiz will use your default settings. Turn off to customize settings for this quiz only.
          </p>
        </div>

        {/* Question Presentation */}
        <div className="space-y-6 py-4">
          <div>
            <h2 className="flex items-center text-lg font-medium">
              <Settings2 className="mr-2 h-5 w-5" />
              Question Presentation
            </h2>
            <p className="text-muted-foreground text-sm">Customize how questions appear to quiz takers, including order and visibility options.</p>
          </div>

          <div className="space-y-6 pl-2">
            <div className="grid items-center gap-2">
              <Label htmlFor="question_order">Question Order</Label>
              <Select disabled={useDefaultSettings} defaultValue="sequential">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent className="w-full">
                  <SelectItem value="sequential">Sequential</SelectItem>
                  <SelectItem value="random">Random</SelectItem>
                </SelectContent>
              </Select>
              {useDefaultSettings && <p className="text-muted-foreground mt-1 text-xs">Using default: Sequential</p>}
            </div>

            <div className="grid w-full items-center gap-2">
              <Label htmlFor="display_format">Display Format</Label>
              <Select disabled={useDefaultSettings} defaultValue="one_per_page">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_per_page">One question per page</SelectItem>
                  <SelectItem value="all_on_page">All questions on one page</SelectItem>
                </SelectContent>
              </Select>
              {useDefaultSettings && <p className="text-muted-foreground mt-1 text-xs">Using default: One question per page</p>}
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="show_question_number">Show Question Numbers</Label>
              <Switch id="show_question_number" disabled={useDefaultSettings} defaultChecked={true} />
            </div>
            {useDefaultSettings && <p className="text-muted-foreground text-xs">Using default: Enabled</p>}

            <div className="flex items-center justify-between">
              <Label htmlFor="question_required">Make Questions Required</Label>
              <Switch id="question_required" disabled={useDefaultSettings} defaultChecked={true} />
            </div>
            {useDefaultSettings && <p className="text-muted-foreground text-xs">Using default: Enabled</p>}
          </div>
        </div>

        <Separator />

        {/* Time Management */}
        <div className="space-y-6 py-4">
          <div>
            <h2 className="flex items-center text-lg font-medium">
              <Clock className="mr-2 h-5 w-5" />
              Time Management
            </h2>
            <p className="text-muted-foreground text-sm">Customize time limits and how time information is displayed during the quiz experience.</p>
          </div>

          <div className="space-y-4 pl-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="visible_timer">Visible Timer</Label>
              <Switch id="visible_timer" disabled={useDefaultSettings} defaultChecked={true} />
            </div>
            {useDefaultSettings && <p className="text-muted-foreground text-xs">Using default: Enabled</p>}
          </div>
        </div>

        <Separator />

        {/* Answer Options */}
        <div className="space-y-6 py-4">
          <div>
            <h2 className="flex items-center text-lg font-medium">
              <Check className="mr-2 h-5 w-5" />
              Answer Options
            </h2>
            <p className="text-muted-foreground text-sm">Set parameters for when to submit and review answers.</p>
          </div>

          <div className="space-y-4 pl-2">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="show_correct_answers">Show Correct Answers</Label>
              <Select disabled={useDefaultSettings} defaultValue="after_quiz">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select when to show answers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="immediately">Immediately after answering</SelectItem>
                  <SelectItem value="after_quiz">After completing the quiz</SelectItem>
                </SelectContent>
              </Select>
              {useDefaultSettings && <p className="text-muted-foreground mt-1 text-xs">Using default: After completing the quiz</p>}
            </div>
          </div>
        </div>

        <Separator />

        {/* Scoring & Feedback */}
        <div className="space-y-6 py-4">
          <div>
            <h2 className="flex items-center text-lg font-medium">
              <BarChart4 className="mr-2 h-5 w-5" />
              Scoring & Feedback
            </h2>
            <p className="text-muted-foreground text-sm">Define how quizzes are scored and what feedback students receive after completion.</p>
          </div>

          <div className="space-y-4 pl-2">
            <div className="grid w-full items-center gap-2">
              <Label htmlFor="passing_threshold">Passing Threshold (%)</Label>
              <div className="flex items-center">
                <Input id="passing_threshold" type="number" min="0" max="100" disabled={useDefaultSettings} defaultValue={70} />
                <span className="ml-2">%</span>
              </div>
              {useDefaultSettings && <p className="text-muted-foreground mt-1 text-xs">Using default: 70%</p>}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-end space-x-4 border-t pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
