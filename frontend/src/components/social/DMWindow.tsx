import { useState, useEffect, useRef } from 'react';
import { Send, MoreVertical, Loader2, Image, X, Reply, Pencil, Trash2, Check } from 'lucide-react';
import { messagesApi, type Friend, type Message } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface ExtendedMessage extends Message {
  replyTo?: {
    id: string;
    content: string;
    sender: { id: string; displayName: string };
  };
  editedAt?: string;
}

interface DMWindowProps {
  friend: Friend;
}

export default function DMWindow({ friend }: DMWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ExtendedMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<ExtendedMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<ExtendedMessage | null>(null);
  const [editText, setEditText] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch messages when friend changes
  useEffect(() => {
    async function fetchMessages() {
      setLoading(true);
      setReplyingTo(null);
      setEditingMessage(null);
      // Try to get existing conversation
      const convoRes = await messagesApi.getConversations();
      if (convoRes.success && convoRes.data) {
        const existingConvo = convoRes.data.find(c => c.friend.id === friend.id);
        if (existingConvo) {
          setConversationId(existingConvo.id);
          // Fetch messages for this conversation
          const msgRes = await messagesApi.getMessages(existingConvo.id);
          if (msgRes.success && msgRes.data) {
            setMessages(msgRes.data.messages as ExtendedMessage[]);
          }
        } else {
          // No existing conversation
          setMessages([]);
          setConversationId(null);
        }
      }
      setLoading(false);
    }
    fetchMessages();
  }, [friend.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if ((!inputText.trim() && !imageUrl) || sending) return;

    setSending(true);

    let res;
    if (replyingTo) {
      res = await messagesApi.replyToMessage(replyingTo.id, inputText.trim(), imageUrl || undefined);
    } else {
      res = await messagesApi.send(friend.id, inputText.trim(), imageUrl || undefined);
    }

    if (res.success && res.data) {
      setMessages(prev => [...prev, res.data!.message as ExtendedMessage]);
      setConversationId(res.data.conversationId);
      setInputText('');
      setImageUrl(null);
      setReplyingTo(null);
    }
    setSending(false);
  };

  const handleDelete = async (messageId: string) => {
    const res = await messagesApi.deleteMessage(messageId);
    if (res.success) {
      setMessages(prev => prev.filter(m => m.id !== messageId));
    }
    setShowMessageMenu(null);
  };

  const handleStartEdit = (msg: ExtendedMessage) => {
    setEditingMessage(msg);
    setEditText(msg.content);
    setShowMessageMenu(null);
  };

  const handleSaveEdit = async () => {
    if (!editingMessage || !editText.trim()) return;

    const res = await messagesApi.editMessage(editingMessage.id, editText.trim());
    if (res.success && res.data) {
      setMessages(prev => prev.map(m =>
        m.id === editingMessage.id ? { ...m, content: editText.trim(), editedAt: new Date().toISOString() } : m
      ));
      setEditingMessage(null);
      setEditText('');
    }
  };

  const handleReply = (msg: ExtendedMessage) => {
    setReplyingTo(msg);
    setShowMessageMenu(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload to storage and get URL
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get initials from display name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Format time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message can be edited (within 15 minutes)
  const canEdit = (msg: ExtendedMessage) => {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    return new Date(msg.createdAt) > fifteenMinutesAgo;
  };

  return (
    <div className="bg-card border border-border rounded-xl h-full flex flex-col">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
              {friend.avatarUrl ? (
                <img src={friend.avatarUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                getInitials(friend.displayName)
              )}
            </div>
            {friend.status === 'online' && (
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-card" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{friend.displayName}</h3>
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
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>Start a conversation with {friend.displayName}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender.id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group`}>
                <div className="relative max-w-[70%]">
                  {/* Reply reference */}
                  {msg.replyTo && (
                    <div className={`text-xs px-3 py-1 mb-1 rounded-lg ${isMe ? 'bg-primary/30 text-primary-foreground/70' : 'bg-secondary/50 text-muted-foreground'}`}>
                      <span className="font-medium">{msg.replyTo.sender.displayName}</span>: {msg.replyTo.content.slice(0, 50)}...
                    </div>
                  )}

                  {/* Message bubble */}
                  <div className={`rounded-2xl px-4 py-2 ${isMe
                    ? 'bg-primary text-primary-foreground rounded-br-none'
                    : 'bg-secondary text-secondary-foreground rounded-bl-none'
                    }`}>
                    {/* Image if present */}
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Shared image"
                        className="max-w-full rounded-lg mb-2 cursor-pointer hover:opacity-90"
                        onClick={() => window.open(msg.imageUrl!, '_blank')}
                      />
                    )}

                    {/* Editing mode */}
                    {editingMessage?.id === msg.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
                          className="flex-1 bg-transparent border-b border-current focus:outline-none text-sm"
                          autoFocus
                        />
                        <button onClick={handleSaveEdit} className="p-1 hover:opacity-70">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => setEditingMessage(null)} className="p-1 hover:opacity-70">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm">{msg.content}</p>
                    )}

                    <div className={`flex items-center gap-1 text-[10px] mt-1 ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                      <span>{formatTime(msg.createdAt)}</span>
                      {msg.editedAt && <span>(edited)</span>}
                    </div>
                  </div>

                  {/* Message actions */}
                  {isMe && !editingMessage && (
                    <div className={`absolute ${isMe ? 'left-0 -translate-x-full' : 'right-0 translate-x-full'} top-1/2 -translate-y-1/2 px-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <div className="flex items-center gap-1 bg-card border border-border rounded-lg shadow-lg p-1">
                        <button
                          onClick={() => handleReply(msg)}
                          className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                          title="Reply"
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                        {canEdit(msg) && (
                          <button
                            onClick={() => handleStartEdit(msg)}
                            className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
                            title="Edit"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="p-1.5 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                  {!isMe && !editingMessage && (
                    <div className={`absolute right-0 translate-x-full top-1/2 -translate-y-1/2 px-2 opacity-0 group-hover:opacity-100 transition-opacity`}>
                      <button
                        onClick={() => handleReply(msg)}
                        className="p-1.5 bg-card border border-border rounded-lg shadow-lg hover:bg-secondary text-muted-foreground hover:text-foreground"
                        title="Reply"
                      >
                        <Reply className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Reply preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-secondary/50 border-t border-border flex items-center gap-3">
          <Reply className="w-4 h-4 text-primary" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-primary font-medium">Replying to {replyingTo.sender.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{replyingTo.content}</p>
          </div>
          <button onClick={() => setReplyingTo(null)} className="p-1 hover:bg-secondary rounded">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>
      )}

      {/* Image preview */}
      {imageUrl && (
        <div className="px-4 py-2 bg-secondary/50 border-t border-border">
          <div className="relative inline-block">
            <img src={imageUrl} alt="Preview" className="h-20 rounded-lg" />
            <button
              onClick={() => setImageUrl(null)}
              className="absolute -top-2 -right-2 p-1 bg-card border border-border rounded-full shadow-lg hover:bg-secondary"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground"
          >
            <Image className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={replyingTo ? `Reply to ${replyingTo.sender.displayName}...` : "Type a message..."}
            className="flex-1 bg-secondary text-foreground rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={handleSend}
            disabled={(!inputText.trim() && !imageUrl) || sending}
            className="p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
