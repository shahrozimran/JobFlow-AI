'use client'
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, Home, RotateCcw } from 'lucide-react'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global Error Boundary caught:', error)
  }, [error])
 
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mb-6 border border-destructive/20 shadow-sm">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">Something went wrong</h2>
      <p className="text-muted-foreground max-w-md mb-8 text-sm md:text-base">
        We've encountered an unexpected error. Our systems have logged the issue and we'll investigate shortly.
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Button onClick={() => window.location.href = '/'} className="w-full sm:w-auto h-11 px-6 rounded-full font-semibold">
          <Home className="w-4 h-4 mr-2" /> Return Home
        </Button>
        <Button variant="outline" onClick={() => reset()} className="w-full sm:w-auto h-11 px-6 rounded-full font-semibold">
          <RotateCcw className="w-4 h-4 mr-2" /> Try Again
        </Button>
      </div>
    </div>
  )
}
