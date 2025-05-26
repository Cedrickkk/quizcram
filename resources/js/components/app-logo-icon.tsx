import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
  return (
    <div className="flex items-center justify-center">
      <img src="/quizcram.png" alt="QuizCram Logo" className="size-14 max-h-full object-contain" style={{ maxWidth: '100%' }} />
    </div>
  );
}
