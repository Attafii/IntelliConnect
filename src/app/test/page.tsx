import { TestApiConnection } from '@/app/components/TestApiConnection';

export default function TestPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      <TestApiConnection />
    </div>
  );
}
