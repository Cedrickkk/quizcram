import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CircleDot, Pencil, Trash2 } from 'lucide-react';
import { Question } from './show';

type QuestionsProps = {
  questions: Question[];
};

export default function Questions({ questions }: QuestionsProps) {
  return (
    <>
      {questions.map(question => {
        console.log(question.options);
        return (
          <div className="mb-6">
            <div className="flex flex-row items-center justify-between border-b bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-2">
                <Select value={question.type}>
                  <SelectTrigger>
                    <div className="flex items-center">
                      {question.type === 'multiple_choice' && (
                        <span className="mr-2">
                          <CircleDot />
                        </span>
                      )}
                      {question.type === 'true_or_false' && (
                        <span className="mr-2">
                          <CircleDot />
                        </span>
                      )}
                      {question.type === 'short_answer' && (
                        <span className="mr-2">
                          <Pencil />
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
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Label htmlFor="required" className="text-sm">
                    Required
                  </Label>
                  <Switch id="required" checked={true} />
                </div>
                <Button variant="ghost" size="icon" className="text-red-500">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-4">
              <div className="mb-6">
                <Label htmlFor="question-text" className="sr-only">
                  Question Text
                </Label>
                <Input
                  id="question-text"
                  placeholder="What is the powerhouse of the cell?"
                  value={question.text}
                  className="rounded-none border-0 border-b px-0 text-lg focus-visible:border-black focus-visible:ring-0"
                />
              </div>

              {question.type === 'multiple_choice' && (
                <div className="mb-6 space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-red-500">Choices *</Label>
                  </div>

                  <RadioGroup value={String(question.options.find(c => c.is_correct)?.id)}>
                    {question.options.map((choice, index) => (
                      <div key={choice.id} className="group flex items-center gap-2">
                        <RadioGroupItem value={String(choice.id)} id={`choice-${choice.id}`} />
                        <Input value={choice.text} placeholder={`Choice ${index + 1}`} className="flex-1" />
                        <Button variant="ghost" size="icon" className="text-red-500 opacity-0 transition-opacity group-hover:opacity-100">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              <div className="grid grid-cols-3 gap-4 border-t pt-4">
                <div>
                  <Label className="mb-1 block text-sm">Randomize Order</Label>
                  <Select value={String(question.order_number)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="keep_choices_in_current_order">Keep choices in current order</SelectItem>
                      <SelectItem value="randomize">Randomize</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="mb-1 block text-sm">Estimation Time</Label>
                  <div className="flex items-center">
                    <Input type="number" className="w-16" />
                    <span className="ml-2">Mins</span>
                  </div>
                </div>

                <div>
                  <Label className="mb-1 block text-sm">Mark as point</Label>
                  <div className="flex items-center">
                    <Input type="number" className="w-16" value={question.points} />
                    <Badge className="ml-2 bg-amber-500 text-white">Points</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        );
      })}
    </>
  );
}
