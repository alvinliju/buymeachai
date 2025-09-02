import { currentUser } from '@clerk/nextjs/server'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function Home() {
  const user = await currentUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Buy Me A <span className="text-[hsl(280,100%,70%)]">Chai</span> ☕
        </h1>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/docs"
          >
            <h3 className="text-2xl font-bold">For Creators →</h3>
            <div className="text-lg">
              Set up your profile and start receiving support from your audience.
            </div>
          </Link>
          
          <Link
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
            href="/explore"
          >
            <h3 className="text-2xl font-bold">For Supporters →</h3>
            <div className="text-lg">
              Discover creators and show your appreciation with chai.
            </div>
          </Link>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <p className="text-xl text-white">
            Ready to get started?
          </p>
          <div className="flex gap-4">
            <SignInButton>
              <button className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="rounded-full bg-[hsl(280,100%,70%)] px-10 py-3 font-semibold text-white no-underline transition hover:bg-[hsl(280,100%,60%)]">
                Get Started
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </div>
  )
}
