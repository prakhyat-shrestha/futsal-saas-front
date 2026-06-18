import type React from "react"

interface AuthLayoutProps {
    children: React.ReactNode
    title: string
    description?: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side - Form */}
            <div className="flex items-center justify-center p-8">
                <div className="mx-auto w-full max-w-sm space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                        {description && <p className="text-sm text-muted-foreground">{description}</p>}
                    </div>
                    {children}
                </div>
            </div>

            {/* Right side - Image */}
            <div className="hidden lg:block relative bg-black">
                <div className="absolute inset-0 bg-[url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xOOAKcDxPyvxlDygdNGtUvjEA6QHBO.png')] bg-cover bg-center opacity-50" />
                <div className="relative h-full flex items-center justify-center text-white p-12">
                    <div className="space-y-6 max-w-lg">
                        <h2 className="text-4xl font-bold">Keep Your Children&#39;s Success</h2>
                        <p className="text-lg text-gray-200">
                            Connect with teachers, track progress, and stay involved in your child&#39;s education journey.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
