import Link from 'next/link'
import { Card, CardAction, CardDescription, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
 
export default function NotFound() {
  return (
    <div className="flex h-screen items-center justify-center p-4">
      <Card className="max-w-md w-full">
      <CardHeader>
        <CardDescription className="text-center">
          Oops! The page you're looking for doesn't exist.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/">Go Back Home</Link>
        </Button>
      </CardContent>
    </Card>
    </div>
  )
}