
import { useState } from 'react';
import { Send, MoreVertical } from 'lucide-react';
import type { Friend, Message } from '../../data/mockSocial';
import { mockDMs, mockCurrentUser } from '../../data/mockSocial';

interface DMWindowProps {
    friend: Friend;
}

export default function DMWindow({ friend }: DMWindowProps) {
    const [messages, setMessages] = useState<Message[]>(mockDMs[friend.id] || []);
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: `m-${Date.now()}`,
            senderId: mockCurrentUser.id,
            content: inputText,
            timestamp: 'Just now'
        };

        setMessages([...messages, newMessage]);
        setInputText('');
    };

    return (
        <div className="bg-card border border-border rounded-xl h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                            {friend.avatar}
                        </div>
                        {friend.status === 'online' && (
                            <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-semibold text-foreground">{friend.name}</h3>
                        <p className="text-xs text-muted-foreground">{friend.status}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => {
                    const isMe = msg.senderId === mockCurrentUser.id;
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${isMe
                                ? 'bg-primary text-primary-foreground rounded-br-none'
                                : 'bg-secondary text-secondary-foreground rounded-bl-none'
                                }`}>
                                <p className="text-sm">{msg.content}</p>
                                <p className={`text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                                    {msg.timestamp}
                                </p>
                            </div>
                        </div>
                    );
                })}
                {messages.length === 0 && (
                    <div className="text-center py-12 text-muted-foreground">
                        <p>Start a conversation with {friend.name}!</p>
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a message..."
                        className="flex-1 bg-secondary text-foreground rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
