import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/dashboard');
  // This part is not strictly necessary as redirect() throws an error.
  // However, returning null satisfies the function signature if redirect() didn't throw.
  return null; 
}
