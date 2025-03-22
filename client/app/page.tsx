import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { BriefcaseIcon, HardHatIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto py-4 px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">RozgaarLink</h1>
          <Link href="/auth/login">
            <Button>Login</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Connect Workers with Employers</h2>
          <p className="text-xl text-muted-foreground">
            RozgaarLink helps daily wage workers find jobs and employers find skilled workers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HardHatIcon className="h-6 w-6" />
                For Workers
              </CardTitle>
              <CardDescription>Find jobs matching your skills and location</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Create a profile with your skills and experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Browse jobs matching your skills and location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Apply for jobs with a single click</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Chat directly with employers</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/login?role=worker" className="w-full">
                <Button className="w-full">Join as Worker</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BriefcaseIcon className="h-6 w-6" />
                For Employers
              </CardTitle>
              <CardDescription>Find skilled workers for your jobs</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Post jobs with detailed requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Browse worker profiles matching your requirements</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Review applications and hire workers</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Chat directly with workers</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Link href="/auth/login?role=employer" className="w-full">
                <Button className="w-full">Join as Employer</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>

      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} RozgaarLink. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

