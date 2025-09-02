import { currentUser } from '@clerk/nextjs/server'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Github } from 'lucide-react'

export default async function Home() {
  const user = await currentUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Development Badge */}
        <div className="flex justify-center mb-8">
          <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
            ⚠️ Under Development - Use with Care
          </Badge>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Buy Me A <span className="text-orange-500">Chai</span> ☕
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A simple platform for creators to receive support from their audience. 
            Made by developers, for developers.
          </p>
          
          {/* Auth Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <SignInButton>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors">
                Get Started
              </button>
            </SignUpButton>
          </div>

          {/* Open Source Badge */}
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Github className="w-5 h-5" />
            <span className="text-sm">Open Source</span>
            <Link 
              href="https://github.com/yourusername/buymeachai" 
              className="text-orange-500 hover:text-orange-600 text-sm font-medium"
            >
              View on GitHub
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">☕</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Simple Support</h3>
            <p className="text-gray-600 text-sm">
              Let your audience show appreciation with virtual chai donations
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Payments</h3>
            <p className="text-gray-600 text-sm">
              Powered by Razorpay for safe and reliable transactions
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h3>
            <p className="text-gray-600 text-sm">
              Monitor your supporters and earnings with a clean dashboard
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Made with ❤️ by developers, for developers
          </p>
        </div>
      </div>
    </div>
  )
}
