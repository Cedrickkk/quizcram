import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CircleDot, Pencil, PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';

type Choice = {
  id: string;
  text: string;
  isCorrect: boolean;
};

type QuestionProps = {
  initialText?: string;
  initialType?: 'multiple_choice' | 'true_or_false' | 'short_answer';
  initialChoices?: Choice[];
  initialPoints?: number;
  initialRequired?: boolean;
  initialTime?: number;
  initialOrder?: 'keep_choices_in_current_order' | 'randomize';
  onSave?: (questionData: any) => void;
  onDelete?: () => void;
  onAddAnotherQuestion?: () => void;
};

export default function Question({
  initialText = '',
  initialType = 'multiple_choice',
  initialChoices = [
    { id: '1', text: 'Nucleus', isCorrect: false },
    { id: '2', text: 'Ribosome', isCorrect: false },
    { id: '3', text: 'Mitochondria', isCorrect: true },
    { id: '4', text: 'Golgi apparatus', isCorrect: false },
  ],
  initialPoints = 1,
  initialRequired = true,
  initialTime = 2,
  initialOrder = 'keep_choices_in_current_order',
  onSave,
  onDelete,
}: QuestionProps) {
  const [questionText, setQuestionText] = useState(initialText);
  const [questionType, setQuestionType] = useState(initialType);
  const [choices, setChoices] = useState<Choice[]>(initialChoices);
  const [points, setPoints] = useState(initialPoints);
  const [required, setRequired] = useState(initialRequired);
  const [time, setTime] = useState(initialTime);
  const [order, setOrder] = useState(initialOrder);

  const handleAddChoice = () => {
    setChoices([...choices, { id: `${choices.length + 1}`, text: '', isCorrect: false }]);
  };

  const handleRemoveChoice = (indexToRemove: number) => {
    if (choices.length <= 2) return; // Minimum 2 choices
    setChoices(choices.filter((_, index) => index !== indexToRemove));
  };

  const handleChoiceTextChange = (index: number, newText: string) => {
    const newChoices = [...choices];
    newChoices[index].text = newText;
    setChoices(newChoices);
  };

  const handleCorrectAnswerChange = (choiceId: string) => {
    const newChoices = choices.map(choice => ({
      ...choice,
      isCorrect: choice.id === choiceId,
    }));
    setChoices(newChoices);
  };

  return (
    <>
      <div className="mb-6">
        <div className="flex flex-row items-center justify-between border-b bg-gray-50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Select value={questionType} onValueChange={(value: any) => setQuestionType(value)}>
              <SelectTrigger>
                <div className="flex items-center">
                  {questionType === 'multiple_choice' && (
                    <span className="mr-2">
                      <CircleDot />
                    </span>
                  )}
                  {questionType === 'true_or_false' && (
                    <span className="mr-2">
                      <CircleDot />
                    </span>
                  )}
                  {questionType === 'short_answer' && (
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
              <Switch id="required" checked={required} onCheckedChange={setRequired} />
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
              value={questionText}
              onChange={e => setQuestionText(e.target.value)}
              className="rounded-none border-0 border-b px-0 text-lg focus-visible:border-black focus-visible:ring-0"
            />
          </div>

          {questionType === 'multiple_choice' && (
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium text-red-500">Choices *</Label>
              </div>

              <RadioGroup value={choices.find(c => c.isCorrect)?.id || ''} onValueChange={handleCorrectAnswerChange}>
                {choices.map((choice, index) => (
                  <div key={choice.id} className="group flex items-center gap-2">
                    <RadioGroupItem value={choice.id} id={`choice-${choice.id}`} />
                    <Input
                      value={choice.text}
                      onChange={e => handleChoiceTextChange(index, e.target.value)}
                      placeholder={`Choice ${index + 1}`}
                      className="flex-1"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveChoice(index)}
                      className="text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </RadioGroup>

              <Button variant="outline" size="sm" onClick={handleAddChoice} className="mt-2">
                Add answers
              </Button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 border-t pt-4">
            <div>
              <Label className="mb-1 block text-sm">Randomize Order</Label>
              <Select value={order} onValueChange={(value: any) => setOrder(value)}>
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
                <Input type="number" value={time} onChange={e => setTime(parseInt(e.target.value))} min={1} className="w-16" />
                <span className="ml-2">Mins</span>
              </div>
            </div>

            <div>
              <Label className="mb-1 block text-sm">Mark as point</Label>
              <div className="flex items-center">
                <Input type="number" value={points} onChange={e => setPoints(parseInt(e.target.value))} min={1} className="w-16" />
                <Badge className="ml-2 bg-amber-500 text-white">Points</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </div>

      <div className="mt-6 flex">
        <Button variant="outline" className="flex items-center gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Another Question
        </Button>
      </div>
    </>
  );
}
