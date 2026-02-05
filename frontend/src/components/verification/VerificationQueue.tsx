
import { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Friend } from '../../data/mockSocial';
import { mockFriends } from '../../data/mockSocial';

interface PendingSubmission {
    id: string;
    user: Friend;
    taskTitle: string;
    imageUrl: string;
    timestamp: string;
    status: 'pending' | 'verified' | 'rejected';
}

// Mock pending submissions
const initialQueue: PendingSubmission[] = [
    {
        id: 'sub1',
        user: mockFriends[0], // Alice
        taskTitle: '50 Pushups',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&auto=format&fit=crop',
        timestamp: '10 mins ago',
        status: 'pending'
    },
    {
        id: 'sub2',
        user: mockFriends[1], // Bob
        taskTitle: 'Read Chapter 4',
        imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop',
        timestamp: '1 hour ago',
        status: 'pending'
    }
];

export default function VerificationQueue() {
    const [queue, setQueue] = useState(initialQueue);

    const handleVerify = (id: string, verdict: 'verified' | 'rejected') => {
        setQueue(queue.map(item =>
            item.id === id ? { ...item, status: verdict } : item
        ));

        // In real app: call API to submit verification
        console.log(`Submission ${id} marked as ${verdict}`);
    };

    const pendingItems = queue.filter(item => item.status === 'pending');

    return (
        <div className="bg-card border border-border rounded-xl flex flex-col h-full">
            <div className="p-4 border-b border-border flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">Verification Queue</h2>
                <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full ml-auto">
                    {pendingItems.length}
                </span>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {pendingItems.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        <p>All caught up! No active tasks to verify.</p>
                    </div>
                ) : (
                    pendingItems.map((item) => (
                        <div key={item.id} className="border border-border rounded-lg p-4 bg-background">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                    {item.user.avatar}
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-foreground">{item.user.name}</p>
                                    <p className="text-xs text-muted-foreground">{item.timestamp}</p>
                                </div>
                            </div>

                            <div className="mb-3">
                                <p className="text-sm font-medium mb-2">{item.taskTitle}</p>
                                <div className="aspect-video rounded-lg overflow-hidden bg-muted relative group">
                                    <img
                                        src={item.imageUrl}
                                        alt="Proof"
                                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <span className="text-white text-sm font-medium">Click to expand</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleVerify(item.id, 'rejected')}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium"
                                >
                                    <XCircle className="w-4 h-4" />
                                    Reject
                                </button>
                                <button
                                    onClick={() => handleVerify(item.id, 'verified')}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors text-sm font-medium"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Approve
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
