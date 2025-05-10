import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';
import { useState } from 'react';

// Import shadcn Sheet components
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function AuthAuthNavigationBar() {
  const [isOpen, setIsOpen] = useState(false);
  const { url } = usePage();

  const isActive = (path: string) => {
    return url.startsWith(path);
  };

  return (
    <header className="relative w-full bg-white shadow-sm">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo - Always visible */}
        <div className="flex items-center">
          <Link href={route('home')} className="text-primary text-xl font-bold">
            QuizCram
          </Link>
        </div>

        {/* Hamburger Menu with Sheet - Only on small screens */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <button className="flex items-center rounded p-1 transition-all duration-300" aria-label="Open Menu">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>

          <SheetContent side="right" className="px-6 py-4">
            <SheetHeader>
              <SheetTitle className="text-primary" asChild>
                <Link href={route('home')}>QuizCram</Link>
              </SheetTitle>
              <SheetDescription className="sr-only">QuizCram</SheetDescription>
            </SheetHeader>

            <div className="mt-8 flex flex-col justify-center space-y-4 text-center">
              {/* Navigation Links */}
              <SheetClose asChild>
                <Link
                  href={route('about')}
                  className={`flex w-full items-center justify-center py-2 text-base transition-colors ${
                    isActive('/about') ? 'text-primary font-medium' : 'hover:text-primary'
                  }`}
                >
                  About
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href={route('how-it-works')}
                  className={`flex w-full items-center justify-center py-2 text-base transition-colors ${
                    isActive('/how-it-works') ? 'text-primary font-medium' : 'hover:text-primary'
                  }`}
                >
                  How It Works
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link
                  href={route('features')}
                  className={`flex w-full items-center justify-center py-2 text-base transition-colors ${
                    isActive('/features') ? 'text-primary font-medium' : 'hover:text-primary'
                  }`}
                >
                  Features
                </Link>
              </SheetClose>

              {/* Authentication Links */}
              {/* Authentication Links in mobile menu */}
              <div className="border-border mt-6 flex w-full flex-col gap-3 space-y-3 border-t pt-6">
                <SheetClose asChild>
                  <Button
                    asChild
                    variant={isActive('/login') ? 'default' : 'ghost'}
                    className={isActive('/login') ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20' : ''}
                  >
                    <Link href={route('login')}>Sign In</Link>
                  </Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button asChild variant={isActive('/register') ? 'secondary' : 'default'} className={isActive('/register') ? 'border-primary' : ''}>
                    <Link href={route('register')}>Sign Up</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation - Only visible on large screens */}
        <div className="hidden items-center justify-between lg:flex lg:w-auto lg:space-x-6">
          <nav className="flex items-center space-x-6">
            <Link
              href={route('about')}
              className={`text-sm transition-colors duration-200 ${
                isActive('/about') ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </Link>
            <Link
              href={route('how-it-works')}
              className={`text-sm transition-colors duration-200 ${
                isActive('/how-it-works') ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              How It Works
            </Link>
            <Link
              href={route('features')}
              className={`text-sm transition-colors duration-200 ${
                isActive('/features') ? 'text-primary font-medium' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Features
            </Link>
          </nav>
        </div>

        {/* Authentication Links - Hidden on small screens */}
        <div className="hidden items-center gap-4 lg:flex">
          <Button
            asChild
            variant={isActive('/login') ? 'default' : 'ghost'}
            className={isActive('/login') ? 'border-primary bg-primary/10 text-primary hover:bg-primary/20' : ''}
          >
            <Link href={route('login')}>Sign In</Link>
          </Button>
          <Button asChild className={isActive('/register') ? 'border-primary' : ''}>
            <Link href={route('register')}>Sign Up</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
