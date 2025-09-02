'use client'

import { UserButton, SignInButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'

export default function Navbar() {
  const { user, isLoaded } = useUser()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-xl font-semibold text-gray-900 hover:text-gray-700 transition-colors">
            BuyMeAChai
          </Link>
          
          <div className="flex items-center gap-6">
            {isLoaded && (
              <>
                {user ? (
                  <div className="flex items-center gap-6">
                    <Link 
                      href="/dashboard" 
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      href="/settings" 
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
                    >
                      Settings
                    </Link>
                    <UserButton 
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-8 h-8",
                          userButtonPopoverCard: "shadow-lg border border-gray-200",
                          userButtonPopoverActions: "text-gray-600"
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <SignInButton mode="modal">
                      <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
                        Sign In
                      </button>
                    </SignInButton>
                    <SignInButton mode="modal">
                      <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-colors">
                        Get Started
                      </button>
                    </SignInButton>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
