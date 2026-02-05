
export interface Friend {
    id: string;
    name: string;
    avatar: string; // URL or placeholder initials
    status: 'online' | 'offline' | 'busy';
    streak: number;
}

export interface Message {
    id: string;
    senderId: string;
    content: string;
    timestamp: string;
}

export interface Squad {
    id: string;
    name: string;
    members: Friend[];
    isPrivate: boolean;
}

export const mockCurrentUser = {
    id: 'u1',
    name: 'John Doe',
    avatar: 'JD'
};

export const mockFriends: Friend[] = [
    { id: 'u2', name: 'Alice Smith', avatar: 'AS', status: 'online', streak: 12 },
    { id: 'u3', name: 'Bob Jones', avatar: 'BJ', status: 'offline', streak: 5 },
    { id: 'u4', name: 'Charlie Day', avatar: 'CD', status: 'busy', streak: 30 },
    { id: 'u5', name: 'Diana Prince', avatar: 'DP', status: 'online', streak: 0 },
];

export const mockSquads: Squad[] = [
    {
        id: 's1',
        name: 'Gym Rats 🏋️‍♂️',
        isPrivate: true,
        members: [mockFriends[0], mockFriends[1]]
    },
    {
        id: 's2',
        name: 'Book Club 📚',
        isPrivate: true,
        members: [mockFriends[2], mockFriends[3]]
    }
];

export const mockDMs: Record<string, Message[]> = {
    'u2': [
        { id: 'm1', senderId: 'u2', content: 'Hey, did you finish your workout?', timestamp: '10:30 AM' },
        { id: 'm2', senderId: 'u1', content: 'Just about to start!', timestamp: '10:31 AM' },
    ],
    'u3': [
        { id: 'm3', senderId: 'u1', content: 'Are we still on for the hackathon?', timestamp: 'Yesterday' },
    ]
};
