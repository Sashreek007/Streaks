import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { verificationApi, type Friend, type Task } from '../../services/api';

interface PendingSubmission {
  id: string;
  proofUrl: string;
  task: Task;
  user: Friend;
  submittedAt: string;
}

export default function VerificationQueue() {
  const [queue, setQueue] = useState<PendingSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQueue() {
      setLoading(true);
      const res = await verificationApi.getQueue();
      if (res.success && res.data) {
        setQueue(res.data as unknown as PendingSubmission[]);
      }
      setLoading(false);
    }
    fetchQueue();
  }, []);

  const handleVerify = async (id: string, approved: boolean) => {
    setProcessingId(id);

    const res = approved
      ? await verificationApi.approve(id)
      : await verificationApi.reject(id);

    if (res.success) {
      setQueue(prev => prev.filter(item => item.id !== id));
    }
    setProcessingId(null);
  };

  // Get initials from display name
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) return `${diffMins} mins ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center gap-2">
        <AlertCircle className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Verification Queue</h2>
        <span className="bg-primary/20 text-primary text-xs px-2 py-0.5 rounded-full ml-auto">
          {queue.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {queue.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>All caught up! No pending verifications.</p>
          </div>
        ) : (
          queue.map((item) => (
            <div key={item.id} className="border border-border rounded-lg p-4 bg-background">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary overflow-hidden">
                  {item.user.avatarUrl ? (
                    <img src={item.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(item.user.displayName)
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.user.displayName}</p>
                  <p className="text-xs text-muted-foreground">{formatTimeAgo(item.submittedAt)}</p>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium mb-2">{item.task.title}</p>
                <div className="aspect-video rounded-lg overflow-hidden bg-muted relative group">
                  <img
                    src={item.proofUrl}
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
                  onClick={() => handleVerify(item.id, false)}
                  disabled={processingId === item.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {processingId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  Reject
                </button>
                <button
                  onClick={() => handleVerify(item.id, true)}
                  disabled={processingId === item.id}
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {processingId === item.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
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
