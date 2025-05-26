import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { CircleDot, Pencil, Save, Trash2 } from 'lucide-react';
import { QuestionType } from './show';

type Choice = {
  id: number;
  text: string;
  questionId: number;
  isCorrect: boolean;
  orderNumber: number;
};

type Question = {
  text: string;
  type: QuestionType;
  choices: Choice[];
  points: number;
  required: boolean;
  orderNumber: number;
  timeEstimation: number;
  randomizeOrder?: boolean;
  image?: File | null;
};

type CreateQuestionFormProps = {
  question: Question;

  onQuestionChange: (updatedQuestion: Question) => void;
  onSave: () => void;
  onCancel?: () => void;

  showCancelButton?: boolean;

  saveButtonText?: string;
  hideSaveButton?: boolean;
};

export default function CreateQuestionForm({
  question,
  onQuestionChange,
  onSave,
  onCancel,
  showCancelButton = false,
  hideSaveButton,
  saveButtonText,
}: CreateQuestionFormProps) {
  // Handlers that update the question through the parent's onQuestionChange

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQuestionChange({
      ...question,
      text: e.target.value,
    });
  };

  const handleQuestionTypeChange = (type: QuestionType) => {
    let updatedChoices = [...question.choices];

    if (type === 'true_or_false') {
      updatedChoices = [
        { id: 1, text: 'True', isCorrect: true, orderNumber: 1, questionId: question.orderNumber },
        { id: 2, text: 'False', isCorrect: false, orderNumber: 2, questionId: question.orderNumber },
      ];
    } else if (type === 'short_answer') {
      updatedChoices = [{ id: 1, text: '', isCorrect: true, orderNumber: 1, questionId: question.orderNumber }];
    } else if (type === 'multiple_choice' && question.type !== 'multiple_choice') {
      updatedChoices = [
        { id: 1, text: '', isCorrect: true, orderNumber: 1, questionId: question.orderNumber },
        { id: 2, text: '', isCorrect: false, orderNumber: 2, questionId: question.orderNumber },
        { id: 3, text: '', isCorrect: false, orderNumber: 3, questionId: question.orderNumber },
        { id: 4, text: '', isCorrect: false, orderNumber: 4, questionId: question.orderNumber },
      ];
    }

    onQuestionChange({
      ...question,
      type,
      choices: updatedChoices,
    });
  };

  const handleRequiredChange = (checked: boolean) => {
    onQuestionChange({
      ...question,
      required: checked,
    });
  };

  const handleChoiceTextChange = (choiceId: number, newText: string) => {
    onQuestionChange({
      ...question,
      choices: question.choices.map(choice => (choice.id === choiceId ? { ...choice, text: newText } : choice)),
    });
  };

  const handleCorrectAnswerChange = (choiceId: string) => {
    onQuestionChange({
      ...question,
      choices: question.choices.map(choice => ({
        ...choice,
        isCorrect: choice.id === parseInt(choiceId),
      })),
    });
  };

  const handleAddChoice = () => {
    const nextId = Math.max(...question.choices.map(c => c.id)) + 1;
    const nextOrderNumber = Math.max(...question.choices.map(c => c.orderNumber)) + 1;

    onQuestionChange({
      ...question,
      choices: [
        ...question.choices,
        {
          id: nextId,
          text: '',
          isCorrect: false,
          orderNumber: nextOrderNumber,
          questionId: question.orderNumber,
        },
      ],
    });
  };

  const handleRemoveChoice = (choiceId: number) => {
    if (question.choices.length <= 2) {
      return;
    }

    const updatedChoices = question.choices.filter(choice => choice.id !== choiceId);

    const hasCorrectChoice = updatedChoices.some(choice => choice.isCorrect);
    if (!hasCorrectChoice && updatedChoices.length > 0) {
      updatedChoices[0].isCorrect = true;
    }

    onQuestionChange({
      ...question,
      choices: updatedChoices,
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value) || 1;
    onQuestionChange({
      ...question,
      points,
    });
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseInt(e.target.value) || 0;
    onQuestionChange({
      ...question,
      timeEstimation: time,
    });
  };

  const handleRandomizeOrderChange = (value: string) => {
    onQuestionChange({
      ...question,
      randomizeOrder: value === 'randomize',
    });
  };

  return (
    <div className="mb-6">
      {/* Question Header */}
      <div className="flex flex-row items-center justify-between border-b bg-gray-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <Select value={question.type} onValueChange={(value: QuestionType) => handleQuestionTypeChange(value)}>
            <SelectTrigger>
              <div className="flex items-center">
                {question.type === 'multiple_choice' && (
                  <span className="mr-2">
                    <CircleDot className="h-4 w-4" />
                  </span>
                )}
                {question.type === 'true_or_false' && (
                  <span className="mr-2">
                    <CircleDot className="h-4 w-4" />
                  </span>
                )}
                {question.type === 'short_answer' && (
                  <span className="mr-2">
                    <Pencil className="h-4 w-4" />
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
            <Switch id="required" checked={question.required} onCheckedChange={handleRequiredChange} />
          </div>
        </div>
      </div>

      {/* Question Content */}
      <CardContent className="p-4">
        <div className="mb-6">
          <Label htmlFor="question-text" className="sr-only">
            Question Text
          </Label>
          <Input
            id="question-text"
            placeholder="What is the powerhouse of the cell?"
            value={question.text}
            onChange={handleQuestionTextChange}
            className="rounded-none border-0 border-b px-0 text-lg focus-visible:border-black focus-visible:ring-0"
          />
        </div>

        {/* Multiple Choice Options */}
        {question.type === 'multiple_choice' && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-red-500">Choices *</Label>
            </div>

            <RadioGroup value={question.choices.find(c => c.isCorrect)?.id.toString() || ''} onValueChange={handleCorrectAnswerChange}>
              {question.choices.map(choice => (
                <div key={choice.id} className="group flex items-center gap-2">
                  <RadioGroupItem value={choice.id.toString()} id={`choice-${choice.id}`} />
                  <Input
                    value={choice.text}
                    onChange={e => handleChoiceTextChange(choice.id, e.target.value)}
                    placeholder={`Choice ${choice.orderNumber}`}
                    className="flex-1"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => handleRemoveChoice(choice.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </RadioGroup>

            <Button variant="outline" size="sm" className="mt-2" onClick={handleAddChoice}>
              Add answers
            </Button>
          </div>
        )}

        {/* True/False Options */}
        {question.type === 'true_or_false' && (
          <div className="mb-6 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Choices</Label>
            </div>

            <RadioGroup value={question.choices.find(c => c.isCorrect)?.id.toString() || ''} onValueChange={handleCorrectAnswerChange}>
              {question.choices.map(choice => (
                <div key={choice.id} className="flex items-center gap-2">
                  <RadioGroupItem value={choice.id.toString()} id={`tf-${choice.id}`} />
                  <Label htmlFor={`tf-${choice.id}`}>{choice.text}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Short Answer */}
        {question.type === 'short_answer' && (
          <div className="mb-6">
            <div className="mb-2 flex items-center justify-between">
              <Label className="text-sm font-medium">Correct Answer</Label>
            </div>
            <Input
              placeholder="Enter the correct answer"
              value={question.choices[0]?.text || ''}
              onChange={e => handleChoiceTextChange(question.choices[0]?.id || 1, e.target.value)}
              className="mt-2"
            />
          </div>
        )}

        {/* Bottom Settings */}
        <div className="grid grid-cols-3 gap-4 border-t pt-4">
          <div>
            <Label className="mb-1 block text-sm">Randomize Order</Label>
            <Select value={question.randomizeOrder ? 'randomize' : 'keep_choices_in_current_order'} onValueChange={handleRandomizeOrderChange}>
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
              <Input type="number" className="w-16" value={question.timeEstimation} onChange={handleTimeChange} min={0} />
              <span className="ml-2">Mins</span>
            </div>
          </div>

          <div>
            <Label className="mb-1 block text-sm">Mark as point</Label>
            <div className="flex items-center">
              <Input type="number" min={1} className="w-16" value={question.points} onChange={handlePointsChange} />
              <Badge className="ml-2 bg-amber-500 text-white">Points</Badge>
            </div>
          </div>
        </div>
      </CardContent>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-end gap-2">
        {showCancelButton && (
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        {!hideSaveButton && (
          <div className="mt-4 flex justify-end">
            <Button onClick={onSave} className="flex items-center gap-2" variant="secondary">
              <Save className="h-4 w-4" />
              {saveButtonText || 'Save Question'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
