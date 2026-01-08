"use client";

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@/types/user';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Shield, ShieldBan, UserCheck } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { formatDate } from '@/lib/utils';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Profile extends User {
    is_blocked: boolean;
    created_at: string;
}

interface UserTableProps {
    initialUsers: Profile[];
}

export default function UserTable({ initialUsers }: UserTableProps) {
    const [users, setUsers] = useState<Profile[]>(initialUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const { toast } = useToast();

    const toggleBlockUser = async (userId: string, currentStatus: boolean) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ is_blocked: !currentStatus })
                .eq('id', userId);

            if (error) throw error;

            setUsers(users.map(u =>
                u.id === userId ? { ...u, is_blocked: !currentStatus } : u
            ));

            toast({
                title: currentStatus ? "User Unblocked" : "User Blocked",
                description: `User has been ${currentStatus ? 'unblocked' : 'blocked'} successfully.`
            });

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Action Failed",
                description: error.message
            });
        }
    };

    const filteredUsers = users.filter(u =>
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.name && u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="bg-card border rounded-xl shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    User Management
                </h2>
                <div className="relative max-w-sm w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-9"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Joined</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9">
                                            <AvatarFallback>{user.email[0].toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex flex-col">
                                            <span className="font-medium">{user.name || 'No Name'}</span>
                                            <span className="text-xs text-muted-foreground">{user.email}</span>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin'
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-muted text-muted-foreground'
                                        }`}>
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {user.is_blocked ? (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                                            <ShieldBan className="h-3 w-3" />
                                            Blocked
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-600">
                                            <UserCheck className="h-3 w-3" />
                                            Active
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="text-muted-foreground text-sm">
                                    {formatDate(user.created_at || new Date().toISOString())}
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() => toggleBlockUser(user.id, !!user.is_blocked)}
                                                className={user.is_blocked ? "text-green-600" : "text-destructive"}
                                            >
                                                {user.is_blocked ? "Unblock User" : "Block User"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
