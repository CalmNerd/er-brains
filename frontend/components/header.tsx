'use client'

import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'
import { DoneAIIcon } from './ui/icons'

// const menuItems = [
//     { name: 'Features', href: '#features' },
//     { name: 'Boards', href: '/dashboard' },
//     { name: 'About', href: '#about' },
// ]

export const HeroHeader = () => {
    // const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                // data-state={menuState && 'active'}
                className={cn('fixed z-20 w-full transition-all duration-300', isScrolled && 'bg-background/75 border-b border-black/5 backdrop-blur-lg')}>
                <div className="mx-auto max-w-5xl px-6">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
                        <div className="flex w-full justify-center">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2 py-4">
                                <DoneAIIcon className='size-6' />
                                <span className='text-2xl font-bold'>DoneAI</span>

                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
