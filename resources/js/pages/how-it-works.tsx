import AuthNavigationBar from '@/pages/auth/navigation-bar';
import { Head } from '@inertiajs/react';
import { useCallback } from 'react';

export default function HowItWorks() {
  const handleSmoothScroll = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();

    const element = document.getElementById(targetId);
    if (!element) return;

    const offset = 20;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }, []);

  return (
    <>
      <Head title="How It Works" />
      <div className="flex min-h-screen flex-col items-center">
        <AuthNavigationBar />

        <main className="container mx-auto w-full max-w-7xl px-12 py-24">
          <div className="mb-12 md:mb-16">
            <h1 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">
              Create custom quiz reviewers for your
              <br className="hidden md:block" />
              upcoming exams.
            </h1>
            <p className="max-w-2xl text-gray-700">
              Transform your study notes into effective practice tests with our quiz creation platform, designed to help you prepare for any exam.
            </p>
          </div>

          <div className="mb-8 lg:hidden">
            <details className="rounded border border-gray-200 bg-white">
              <summary className="cursor-pointer px-4 py-3 font-medium">Jump to section</summary>
              <div className="border-t border-gray-200 p-4">
                <nav className="space-y-2">
                  <a href="#overview" className="block text-sm text-gray-700 hover:text-gray-900" onClick={e => handleSmoothScroll(e, 'overview')}>
                    Overview
                  </a>
                  <a
                    href="#creating_your_first_quiz"
                    className="block text-sm text-gray-700 hover:text-gray-900"
                    onClick={e => handleSmoothScroll(e, 'creating_your_first_quiz')}
                  >
                    Creating Your Quiz
                  </a>
                  <a
                    href="#adding_questions"
                    className="block text-sm text-gray-700 hover:text-gray-900"
                    onClick={e => handleSmoothScroll(e, 'adding_questions')}
                  >
                    Adding Questions
                  </a>
                  <a
                    href="#setting_time_constraints"
                    className="block text-sm text-gray-700 hover:text-gray-900"
                    onClick={e => handleSmoothScroll(e, 'setting_time_constraints')}
                  >
                    Setting Time Limits
                  </a>
                  <a
                    href="#tracking_progress"
                    className="block text-sm text-gray-700 hover:text-gray-900"
                    onClick={e => handleSmoothScroll(e, 'tracking_progress')}
                  >
                    Tracking Progress
                  </a>
                </nav>
              </div>
            </details>
          </div>

          <div className="relative flex flex-col gap-12 lg:flex-row">
            <div className="hidden lg:sticky lg:top-6 lg:block lg:max-h-[calc(100vh-100px)] lg:w-64 lg:shrink-0 lg:self-start">
              <h2 className="mb-3 font-bold">Topics</h2>
              <nav className="space-y-2 overflow-y-auto">
                <p className="text-muted-foreground text-sm">Custom Quiz Creation</p>
                <p className="text-muted-foreground text-sm">Timed Practice Tests</p>
                <p className="text-muted-foreground text-sm">Multiple-Choice Questions</p>
                <p className="text-muted-foreground text-sm">True/False Questions</p>
                <p className="text-muted-foreground text-sm">Essay Questions</p>
              </nav>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="mb-12 aspect-video w-full bg-gray-100"></div>
              <section>
                <h2 className="mb-8 text-3xl font-bold">How QuizCram Works</h2>
                <div className="mb-10" id="overview">
                  <h3 className="mb-3 text-xl font-bold">Overview</h3>
                  <p className="mb-6 text-gray-700">
                    This platform allows you to create personalized quiz reviewers for any upcoming test or exam. By converting your study materials
                    into interactive questions, you can effectively test your knowledge, identify weak areas, and improve retention before the exam.
                  </p>
                </div>
                <div className="mb-10" id="creating_your_first_quiz">
                  <h3 className="mb-5 text-xl font-bold">Creating Your First Quiz</h3>
                  <p className="mb-4 text-gray-700">
                    Before creating your quiz reviewer, gather your study materials and identify key concepts that might appear on your exam. This
                    preparation will help you design effective questions that accurately reflect what you need to know.
                  </p>
                  <h4 className="mb-2 font-bold">Essential steps for quiz creation:</h4>
                  <ul className="mb-6 list-disc pl-8 text-gray-700">
                    <li>Select a subject and topic for your reviewer</li> <li>Choose question types (multiple choice, true/false, short answer)</li>
                    <li>Set appropriate time limits to simulate exam conditions</li> <li>Add explanations to help understand correct answers</li>
                  </ul>
                </div>
                <div className="mb-10" id="adding_questions">
                  <h3 className="mb-5 text-xl font-bold">Adding Questions</h3>
                  <p className="mb-4 text-gray-700">
                    The question editor lets you create various question types to match your exam format. You can include images, formulas, and
                    detailed explanations for each answer to maximize learning value.
                  </p>
                  <h4 className="mb-2 font-bold">Question types available:</h4>
                  <ul className="mb-6 list-disc pl-8 text-gray-700">
                    <li>Multiple choice with single correct answer</li> <li>Multiple choice with multiple correct answers</li>
                    <li>True/False statements</li> <li>Short answer questions</li> <li>Matching questions</li>
                    <li>Fill-in-the-blank questions</li>
                  </ul>
                  <p className="mb-4 text-gray-700">
                    Each question can include rich media like images, diagrams, or even mathematical formulas to help clarify complex concepts. You
                    can also provide detailed explanations for each answer option to help students understand why certain answers are correct or
                    incorrect.
                  </p>
                </div>
                <div className="mb-10" id="setting_time_constraints">
                  <h3 className="mb-5 text-xl font-bold">Setting Time Constraints</h3>
                  <p className="mb-4 text-gray-700">
                    Simulate real exam conditions by adding time limits to your quiz. This helps build time management skills and reduces exam anxiety
                    by preparing you for the pressure of timed assessments.
                  </p>
                  <h4 className="mb-2 font-bold">Benefits of timed practice:</h4>
                  <ul className="mb-6 list-disc pl-8 text-gray-700">
                    <li>Builds confidence for test day</li> <li>Improves answer speed while maintaining accuracy</li>
                    <li>Reduces test anxiety through practice under pressure</li> <li>Helps identify knowledge gaps that need more review</li>
                  </ul>
                  <p className="mb-4 text-gray-700">
                    You can customize time limits for the entire quiz or set different time allocations for individual questions based on their
                    difficulty level. QuizCram also provides a timer display to help you track remaining time during practice.
                  </p>
                </div>

                <div className="mb-10" id="tracking_progress">
                  <h3 className="mb-5 text-xl font-bold">Tracking Your Progress</h3>
                  <p className="mb-4 text-gray-700">
                    QuizCram automatically saves your quiz results, allowing you to track improvement over time. Performance analytics help identify
                    your strengths and areas that need additional review.
                  </p>
                  <p className="mb-4 text-gray-700">
                    Detailed statistics show your performance across different subjects and topics, helping you optimize your study time by focusing
                    on areas where you can make the most improvement.
                  </p>
                </div>
              </section>
            </div>

            <div className="hidden lg:sticky lg:top-6 lg:block lg:max-h-[calc(100vh-100px)] lg:w-64 lg:shrink-0 lg:self-start">
              <div className="rounded-md p-4">
                <h3 className="mb-3 text-sm font-medium text-gray-500">ON THIS PAGE</h3>
                <nav className="space-y-2 overflow-y-auto">
                  <a href="#overview" className="block text-xs text-gray-700 hover:text-gray-900" onClick={e => handleSmoothScroll(e, 'overview')}>
                    Overview
                  </a>
                  <a
                    href="#creating_your_first_quiz"
                    className="block scroll-smooth text-xs text-gray-700 hover:text-gray-900"
                    onClick={e => handleSmoothScroll(e, 'creating_your_first_quiz')}
                  >
                    Creating Your Quiz
                  </a>
                  <a
                    href="#adding_questions"
                    className="block scroll-smooth text-xs text-gray-700 hover:text-gray-900"
                    onClick={e => handleSmoothScroll(e, 'adding_questions')}
                  >
                    Adding Questions
                  </a>
                  <a
                    href="#setting_time_constraints"
                    className="block scroll-smooth text-xs text-gray-700 hover:text-gray-900"
                    onClick={e => handleSmoothScroll(e, 'setting_time_constraints')}
                  >
                    Setting Time Limits
                  </a>
                  <a
                    href="#tracking_progress"
                    className="block scroll-smooth text-xs text-gray-700 hover:text-gray-900"
                    onClick={e => handleSmoothScroll(e, 'tracking_progress')}
                  >
                    Tracking Progress
                  </a>
                </nav>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
