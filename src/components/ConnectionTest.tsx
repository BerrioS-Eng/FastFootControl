import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function ConnectionTest() {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testBackendConnection = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      // Test auth endpoint
      const authResponse = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: 'test',
          password: 'test'
        }),
      });

      const authData = await authResponse.text();
      
      if (authResponse.ok) {
        setTestResult('✅ Connection successful! Backend is responding.');
      } else {
        setTestResult(`⚠️ Backend responded but auth failed (expected): ${authResponse.status} - This is normal for a test connection.`);
      }
    } catch (error) {
      setTestResult(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectConnection = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      // Test direct backend connection
      const response = await fetch('https://fast-food-back-uh35.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: 'test',
          password: 'test'
        }),
      });

      setTestResult(`🔄 Direct connection attempt - Status: ${response.status}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('CORS')) {
        setTestResult('🔒 CORS error confirmed - This is why we need the proxy APIs');
      } else {
        setTestResult(`❌ Direct connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border rounded-lg space-y-4">
      <h3 className="text-lg font-semibold">Backend Connection Test</h3>
      
      <div className="space-x-2">
        <Button 
          onClick={testBackendConnection} 
          disabled={isLoading}
          variant="default"
        >
          {isLoading ? 'Testing Proxy...' : 'Test Proxy Connection'}
        </Button>
        
        <Button 
          onClick={testDirectConnection} 
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? 'Testing Direct...' : 'Test Direct Connection'}
        </Button>
      </div>

      {testResult && (
        <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded text-sm">
          <pre>{testResult}</pre>
        </div>
      )}
    </div>
  );
}