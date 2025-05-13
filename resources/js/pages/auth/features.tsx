import { Badge } from '@/components/ui/badge';
import { Head } from '@inertiajs/react';
import { ArrowRightLeft, BarChart3, Book, Clock, Cog, Share2 } from 'lucide-react';
import AuthNavigationBar from './navigation-bar';

// Updated quiz-focused features
const quizFeatures = [
  {
    number: 1,
    title: 'Set up your question bank',
    description: 'Configure your study materials and organize topics for effective quiz creation.',
    icon: <Book className="size-6" />,
  },
  {
    number: 2,
    title: 'Generate custom quizzes',
    description: 'Easily create and share personalized quizzes with varied question types and difficulty levels.',
    icon: <Cog className="size-6" />,
  },
  {
    number: 3,
    title: 'Automate your study sessions',
    description: 'Set up scheduled practice sessions with spaced repetition to optimize your learning.',
    icon: <Clock className="size-6" />,
  },
  {
    number: 4,
    title: 'Track your progress',
    description: 'Monitor your performance with detailed analytics and identify areas for improvement.',
    icon: <BarChart3 className="size-6" />,
  },
];

export default function Features() {
  return (
    <>
      <Head title="Features" />
      <div className="flex min-h-screen flex-col items-center bg-white/90">
        <AuthNavigationBar />

        <main className="container mx-auto w-full max-w-7xl px-12 py-24">
          <div className="container mx-auto max-w-screen-xl px-4">
            <div className="mb-16 md:mb-24">
              <Badge variant="outline" className="mb-3 rounded-full">
                Start your journey here
              </Badge>
              <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">Build your custom study plan in no time</h1>
              <p className="max-w-2xl text-gray-600">
                Create personalized quiz reviewers that adapt to your learning style and help you prepare for exams effectively.
              </p>
            </div>

            <div className="grid gap-y-16 md:grid-cols-2 md:gap-x-8 md:gap-y-20 lg:gap-x-16">
              {quizFeatures.map(feature => (
                <div key={feature.number} className="relative">
                  <p className="text-primary text-4xl">{feature.number}</p>
                  <h3 className="mb-3 text-xl font-medium md:text-2xl">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-20 rounded-lg bg-gray-100 p-6 md:mt-32 md:p-12">
              <div className="flex aspect-[16/9] items-center justify-center bg-gray-200">
                <div className="text-center text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="mx-auto mb-3 h-16 w-16"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21a48.309 48.309 0 01-8.135-1.088c-1.717-.293-2.3-2.379-1.067-3.61L5 14.5"
                    />
                  </svg>
                  <p className="text-lg font-medium">QuizCram Dashboard Demo</p>
                </div>
              </div>
            </div>

            <div className="mt-20 md:mt-32">
              <h2 className="mb-12 text-2xl font-bold md:text-3xl">More powerful features</h2>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <ArrowRightLeft className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-medium">Multiple Question Types</h3>
                  <p className="text-gray-600">
                    Create diverse quizzes with multiple-choice, true/false, matching, and short answer questions to thoroughly test your knowledge.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <Clock className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-medium">Timed Practice Tests</h3>
                  <p className="text-gray-600">
                    Simulate real exam conditions with customizable time limits and improve your ability to work efficiently under pressure.
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="bg-primary/10 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                    <Share2 className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-lg font-medium">Quiz Sharing</h3>
                  <p className="text-gray-600">
                    Collaborate with classmates by sharing your custom quizzes, allowing group study sessions and knowledge exchange.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
