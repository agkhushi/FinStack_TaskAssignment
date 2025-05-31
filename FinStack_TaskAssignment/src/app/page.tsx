import { redirect } from 'next/navigation';
import { Suspense } from 'react';

function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      {redirect('/dashboard')}
    </Suspense>
  );
}
