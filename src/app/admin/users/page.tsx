


'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface User {
    id: string;
    Username: string;
    email: string;
    role: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    // Kullanıcıları veritabanından çekme
    const fetchUsers = async () => {
        try {
            const response = await fetch('/api/users', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) throw new Error('Kullanıcılar yüklenirken bir hata oluştu.');
            const data = await response.json();
            console.log('Fetched users:', data);
            setUsers(data);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    // Role güncellemeyi işleyen fonksiyon
    const editUserRoles = async (id: string, role: string) => {
        try {
            const response = await fetch(`/api/users`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, role }), // id ve role gönderiliyor
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'API hatası');
            }

            const updatedUser = await response.json();
            // Yeni role'ü state'e yansıt
            setUsers((prevUsers) =>
                prevUsers.map((user) =>
                    user.id === updatedUser.id ? { ...user, role: updatedUser.role } : user
                )
            );
        } catch (error) {
            console.error('Hata:', error instanceof Error ? error.message : error);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Kullanıcılar</h1>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 size={64} />
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Username</TableHead>
                                <TableHead >Email</TableHead>
                                <TableHead >Role</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell >{user.Username}</TableCell>
                                    <TableCell >{user.email}</TableCell>
                                    <TableCell >
                                        <Select
                                            value={user.role} 
                                            onValueChange={(value) => editUserRoles(user.id, value)}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Role seçin" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="admin">Admin</SelectItem>
                                                <SelectItem value="user">User</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
