import { Button } from '@/components/ui/button';
import AuthNavigationBar from '@/pages/auth/navigation-bar';
import { Head, Link } from '@inertiajs/react';

export default function Welcome() {
  return (
    <>
      <Head title="QuizCram - Master Your Quizzes" />
      <div className="mx-auto flex min-h-screen flex-col items-center bg-white/90">
        <AuthNavigationBar />
        <main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12 text-center md:py-16">
          <div className="mb-12 max-w-2xl">
            <h1 className="mb-3 text-4xl font-bold md:text-5xl">
              Master your <span className="text-gray-900">Quizzes</span> with <span className="text-primary">QuizCram</span>
            </h1>
            <p className="mx-auto mb-8 max-w-lg text-gray-600">
              The smarter way to study. Create, practice, and ace your quizzes with our powerful learning platform.
            </p>
            <Button asChild size="lg">
              <Link href={route('register')}>Get started now</Link>
            </Button>
          </div>

          <div className="w-full max-w-3xl">
            <div className="overflow-hidden rounded-lg bg-white shadow-xl">
              {/* Quiz App Window Header */}
              <div className="flex items-center border-b border-gray-200 bg-gray-50 p-3">
                <div className="flex space-x-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-400"></div>
                  <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                  <div className="h-3 w-3 rounded-full bg-green-400"></div>
                </div>
                <div className="mx-auto text-xs text-gray-500">quizcram.app</div>
              </div>

              {/* Quiz Content */}
              <div className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-800">Biology Final Exam</h2>
                  <div className="rounded-full bg-[#FFF8D6] px-3 py-1 text-xs font-medium text-[#F8B803]">Question 7 of 20</div>
                </div>

                <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-left">
                  <p className="text-base font-medium text-gray-800">Which organelle is responsible for protein synthesis in cells?</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center rounded-md border border-gray-200 p-4">
                    <div className="mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                      <div className="h-3 w-3 rounded-full"></div>
                    </div>
                    <span>Mitochondria</span>
                  </div>

                  <div className="flex items-center rounded-md border border-gray-200 p-4">
                    <div className="mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                      <div className="h-3 w-3 rounded-full"></div>
                    </div>
                    <span>Golgi Apparatus</span>
                  </div>

                  <div className="flex items-center rounded-md border-2 border-[#F8B803] bg-[#FFF8D6] p-4">
                    <div className="bg-primary mr-4 flex h-5 w-5 items-center justify-center rounded-full text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="font-medium">Ribosomes</span>
                  </div>

                  <div className="flex items-center rounded-md border border-gray-200 p-4">
                    <div className="mr-4 flex h-5 w-5 items-center justify-center rounded-full border border-gray-300">
                      <div className="h-3 w-3 rounded-full"></div>
                    </div>
                    <span>Lysosomes</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Previous</button>
                  <button className="bg-primary hover:bg-primary/80 rounded-md px-4 py-2 text-sm font-medium text-white">Next Question</button>
                </div>
              </div>

              {/* Quiz Footer Stats */}
              <div className="grid grid-cols-3 divide-x border-t border-gray-200 bg-gray-50">
                <div className="p-4 text-center">
                  <div className="text-xl font-bold text-[#F8B803]">85%</div>
                  <div className="text-xs text-gray-500">Correct</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-xl font-bold text-[#F8B803]">12:45</div>
                  <div className="text-xs text-gray-500">Time Left</div>
                </div>
                <div className="p-4 text-center">
                  <div className="text-xl font-bold text-[#F8B803]">13</div>
                  <div className="text-xs text-gray-500">Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
