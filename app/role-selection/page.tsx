"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users } from "lucide-react"
import { useAuthStore } from "@/store/auth"
import { useProfileStore } from "@/store/profile"

const roles = [
  {
      id: "Admin",
      title: "Admin",
      description: "Manage teachers, classes, and more",
      icon: GraduationCap,
  },
  {
    id: "Tenant",
    title: "Tenant",
    description: "Access your class dashboard, manage grades, and communicate with students",
    icon: GraduationCap,
  },
  {
    id: "Player",
    title: "Player",
    description: "Monitor your progress and communicate with teachers",
    icon: Users,
  },
]

export default function RoleSelectionPage() {
  const { user, token } = useAuthStore()
  const { setProfile } = useProfileStore()
  console.log("User:", user);
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  console.log("Selected Role:", selectedRole);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedRole || !user) return
    setIsLoading(true)
    setError(null)

    const formattedRole =
      selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1).toLowerCase(); // Ensure capitalization

    const payload = {
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      role: formattedRole,
      userId: user?.$id,
    }
    console.log("Payload", payload)

    try {
      const response = await fetch("https://edtech-saas-backend.vercel.app/api/profile", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || "Failed to create profile")
      }
      console.log("Profile Data", data)
      setProfile({
        firstName: data?.user?.firstName,
        lastName: data?.user?.lastName,
        email: data?.user?.email,
        role: data?.user?.role,
        userId: data?.user?.userId,
        $id: data?.user?.$id,
        $createdAt: data?.user?.$createdAt,
      })
      router.push("/dashboard")
    } catch (err) {
      const error = err as Error
      setError(error.message)
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Select your role</h1>
            <p className="text-gray-500">Choose your role to access the appropriate dashboard</p>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4">
              {roles.map((role) => {
                const Icon = role.icon
                return (
                    <Card
                    key={role.id}
                    className={`cursor-pointer transition-colors ${selectedRole === role.id ? "border-black" : ""}`}
                    onClick={() => setSelectedRole(role.title)}
                    >
                      <CardContent className="flex items-start gap-4 p-6">
                        <div className="rounded-full p-2 bg-gray-100">
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-medium">{role.title}</h3>
                          <p className="text-sm text-gray-500">{role.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                )
              })}
            </div>

            <Button className="w-full" type="submit" disabled={!selectedRole || isLoading}>
              {isLoading ? "Confirming..." : "Continue"}
            </Button>
          </form>
        </div>
      </div>
  )
}
