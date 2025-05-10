import { Separator } from '@/components/ui/separator';
import AuthNavigationBar from '@/pages/auth/navigation-bar';
import { Head, Link } from '@inertiajs/react';

export default function About() {
  return (
    <>
      <Head title="About" />
      <div className="flex min-h-screen flex-col items-center bg-white/90">
        <AuthNavigationBar />
        <main className="container mx-auto w-full max-w-5xl px-12 py-24">
          <div className="flex flex-col gap-24">
            <div className="text-center">
              <h1 className="mb-3 text-5xl font-bold">Welcome to QuizCram</h1>
              <p className="mx-auto max-w-2xl text-gray-600">
                Meet our educational platform, discover our mission, and learn how we're making learning more engaging and effective.
              </p>
            </div>

            <div>
              <div className="mb-4 grid grid-cols-3 gap-4">
                <div className="aspect-square bg-gray-200"></div>
                <div className="aspect-square bg-gray-200"></div>
                <div className="aspect-square bg-gray-200"></div>
              </div>

              <div className="mb-8 grid grid-cols-3 gap-4">
                <div className="aspect-square bg-gray-200"></div>
                <div className="aspect-square bg-gray-200"></div>
                <div className="aspect-square bg-gray-200"></div>
              </div>
            </div>

            <Separator />

            <div className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div>
                <h2 className="mb-3 text-xl font-bold text-gray-800">Our Vision</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    For years, the process of studying and self-assessment has been challenging—and often tedious. Many students struggle with
                    organizing knowledge gaps and effectively preparing for exams.
                  </p>
                  <p>
                    What if you could test your knowledge in a fun, interactive way with instant challenges? What if you could get immediate feedback
                    that helps you learn?
                  </p>
                  <p>
                    With QuizCram, you can! Our platform lets you take personalized quizzes across various subjects—all while tracking your progress
                    and identifying strengths.
                  </p>
                  <p>We believe that everyone should be able to access quality educational tools, regardless of their background.</p>
                </div>
              </div>

              <div>
                <h2 className="mb-3 text-xl font-bold text-gray-800">Our Mission</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    QuizCram has been developing educational tools for students and educators, focusing on effectiveness and engagement to enrich
                    learning experiences. We know that the best learning happens when you actively test your knowledge.
                  </p>
                  <p>
                    We initially developed these quizzes for our own classroom use, and now everyone can benefit from them too. We are dedicated to
                    combining pedagogical principles with years of technical expertise.
                  </p>
                  <p>
                    Our team is made up of passionate educators and developers who believe that all students deserve the power to take control of
                    their learning journey. We are dedicated to helping you achieve your academic goals, and we can't wait to see what you learn!
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-accent flex w-full flex-col gap-8 overflow-hidden p-8 lg:flex-row lg:items-center lg:justify-between lg:p-16">
              <div>
                <h3 className="text-xl font-bold">Part of</h3>
                <h3 className="text-xl font-bold">Your Educational Journey</h3>
              </div>
              <Link href="/register" className="bg-primary hover:bg-primary/90 rounded-md px-6 py-2 text-sm font-medium text-white">
                Start Using QuizCram
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
