import { useEffect, useState } from 'react'
import { Menu, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Types for navigation items
interface NavItem {
    title: string
    href: string
    dropdownItems?: { title: string; href: string }[]
}

interface MobileNavProps {
    items: NavItem[]
    setIsOpen: (open: boolean) => void
}

const navItems = [
    {
        title: 'Pathways',
        href: '/pathways',
        dropdownItems: [
            { title: "Create Pathway", href: "/pathway/create" },
            { title: "Browse Pathway", href: "/pathway/browse" },
        ]
    },
    {
        title: 'Leaderboard',
        href: '/leaderboard',
    },
]

const MobileNav = ({ items, setIsOpen }: MobileNavProps) => {
    const { pathname } = useLocation()
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({})

    const toggleDropdown = (title: string) => {
        setOpenDropdowns(prev => ({
            ...prev,
            [title]: !prev[title]
        }))
    }

    return (
        <motion.nav
            className="mt-6"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
        >
            <ul className="grid gap-6 px-4">
                {items.map((item) => (
                    <motion.li
                        key={item.title}
                        className="flex flex-col"
                        whileHover={{ scale: 1.02 }}
                    >
                        {item.dropdownItems ? (
                            <>
                                <button
                                    onClick={() => toggleDropdown(item.title)}
                                    className="flex items-center justify-between text-[#0A0B1F] hover:opacity-70 transition-opacity duration-300"
                                >
                                    <span>{item.title}</span>
                                    <motion.div
                                        animate={{ rotate: openDropdowns[item.title] ? 180 : 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <ChevronDown className="h-4 w-4" />
                                    </motion.div>
                                </button>
                                <AnimatePresence>
                                    {openDropdowns[item.title] && (
                                        <motion.ul
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="ml-4 mt-2 space-y-2 overflow-hidden"
                                        >
                                            {item.dropdownItems.map((dropdownItem) => (
                                                <motion.li
                                                    key={dropdownItem.title}
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <Link
                                                        to={dropdownItem.href}
                                                        className="block text-[#0A0B1F] hover:opacity-70 transition-opacity duration-300"
                                                        onClick={() => setIsOpen(false)}
                                                    >
                                                        {dropdownItem.title}
                                                    </Link>
                                                </motion.li>
                                            ))}
                                        </motion.ul>
                                    )}
                                </AnimatePresence>
                            </>
                        ) : (
                            <Link
                                to={item.href}
                                className={`text-[#0A0B1F] hover:opacity-70 transition-opacity duration-300 ${pathname === item.href ? "text-[#3EEEC0]" : ""
                                    }`}
                                onClick={() => setIsOpen(false)}
                            >
                                {item.title}
                            </Link>
                        )}
                    </motion.li>
                ))}
                <motion.li whileHover={{ scale: 1.02 }}>
                    <Button
                        className="w-full px-4 py-2 text-md bg-[#0A0B1F] text-white hover:bg-[#3EEEC0] transition-colors duration-300"
                    >
                        Sign up for free
                    </Button>
                </motion.li>
            </ul>
        </motion.nav>
    )
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const navigate = useNavigate()
    //   const { pathname } = useLocation()

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.header
            className={`fixed top-0 z-50 w-full border-b border-border/40 transition-colors duration-500
        ${isScrolled ? 'bg-white' : 'bg-[#FFFC6D]'}`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-8">
                <motion.div
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                >
                    <Link to="/" className="text-[#0A0B1F] flex text-xl font-bold transition-colors gap-2 items-center justify-center duration-300">
                        <img src="https://res.cloudinary.com/dnvh2fya6/image/upload/v1736544667/cheese_aen61j.png" alt="" height={20} width={30} />
                        CheeseCake
                    </Link>
                </motion.div>
                <div className="flex items-center space-x-8">
                    <nav className="hidden md:flex md:items-center">
                        <ul className="flex space-x-8">
                            {navItems.map((item) => (
                                <motion.li
                                    key={item.title}
                                    className="relative"
                                    whileHover={{ scale: 1.05 }}
                                >
                                    {item.dropdownItems ? (
                                        <DropdownMenu>
                                            <DropdownMenuTrigger className="flex items-center font-semibold space-x-2 text-[#0A0B1F] hover:opacity-70 transition-opacity duration-300">
                                                <span>{item.title}</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent className="bg-white rounded-lg shadow-lg">
                                                {item.dropdownItems.map((dropdownItem) => (
                                                    <DropdownMenuItem key={dropdownItem.title}>
                                                        <Link
                                                            to={dropdownItem.href}
                                                            className="block px-4 py-2 font-semibold text-sm text-[#0A0B1F] hover:text-[#3EEEC0] transition-colors duration-300"
                                                        >
                                                            {dropdownItem.title}
                                                        </Link>
                                                    </DropdownMenuItem>
                                                ))}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    ) : (
                                        <Link
                                            to={item.href}
                                            className="text-[#0A0B1F] font-semibold text-md hover:opacity-70 transition-opacity duration-300"
                                        >
                                            {item.title}
                                        </Link>
                                    )}
                                </motion.li>
                            ))}
                        </ul>
                    </nav>
                    <motion.div
                        className="hidden md:block"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Button
                            className="text-sm bg-[#0A0B1F] text-white hover:bg-[#3EEEC0] transition-colors duration-300"
                            onClick={() => navigate('/login')}
                        >
                            Sign up for free
                        </Button>
                    </motion.div>
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button
                                variant="ghost"
                                className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                            >
                                <Menu className="h-5 w-5 text-[#0A0B1F]" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="pr-0 bg-[#FFFC6D]">
                            <MobileNav items={navItems} setIsOpen={setIsOpen} />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </motion.header>
    )
}

export default Navbar