'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function PaymentErrorPage() {
  const router = useRouter();

  useEffect(() => {
    // You can add any cleanup or logging logic here
  }, []); // Ensure dependency array is empty

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Payment Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">We're sorry, but there was an error processing your payment.</p>
          <Button onClick={() => router.push('/checkout')}>Try Again</Button>
        </CardContent>
      </Card>
    </div>
  );
}

