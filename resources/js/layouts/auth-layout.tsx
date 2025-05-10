import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import AuthNavigationBar from '@/pages/auth/navigation-bar';

export default function AuthLayout({ children, title, description, ...props }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex min-h-screen flex-col">
      <AuthNavigationBar />
      <AuthLayoutTemplate title={title} description={description} {...props}>
        {children}
      </AuthLayoutTemplate>
    </div>
  );
}
