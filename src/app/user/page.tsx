


'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from '@/hooks/use-toast'

interface UserInfo {
  id: string
  Username: string
  email: string
  adress: string
  phone: string
  gender: string
}

export default function UserProfile() {
  const [user, setUser] = useState<UserInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { user: authUser, updateProfile } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authUser) 
          
        return;
      try {
        const response = await fetch('/api/usersinfo');
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
  
        console.log('Fetched data:', data); // Debug için
        const loggedInUser = data.find((u) => u.email === authUser?.email);
  
        if (loggedInUser) {
          setUser(loggedInUser);
        } else {
          setError('User data not found for the logged-in user.');
        }
      } catch (err) {
        setError('An error occurred while fetching user data');
      } finally {
        setIsLoading(false);
      }
    };
    console.log('authUser:', authUser);
  
    fetchUserData();
  }, [authUser]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (user) {
      setUser({ ...user, [e.target.name]: e.target.value })
    }
  }

  const handleGenderChange = (value: string) => {
    if (user) {
      setUser({ ...user, gender: value })
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;
  
    console.log('Payload being sent:', user);
  
    try {
      const response = await fetch('/api/usersinfo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });
  
      console.log('Response:', response);
      const data = await response.json();
      console.log('Response Data:', data);
  
      if (!response.ok) throw new Error(data.message || 'Failed to update profile');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!user) {
    return <div>No user data found</div>
  }

  if (!authUser) {
    return <div>Loading user information...</div>;
  }
  

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="Username">Username</Label>
                <Input
                  id="Username"
                  name="Username"
                  value={user.Username}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="adress">Address</Label>
                <Input
                  id="adress"
                  name="adress"
                  value={user.adress}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={user.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  disabled={!isEditing}
                  value={user.gender}
                  onValueChange={handleGenderChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <CardFooter className="flex justify-between mt-4">
              {isEditing ? (
                <>
                  <Button type="submit">Save Changes</Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}