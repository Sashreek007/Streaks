import { useState, useEffect } from 'react';
import { Users, UserPlus, Copy, RefreshCw, Crown, Shield, UserMinus, ArrowLeft, Loader2, Check, Flame, X } from 'lucide-react';
import { squadsApi, friendsApi, type Squad, type Friend } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface SquadMember {
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    currentStreak: number;
    totalXp: number;
  };
  role: string;
}

interface SquadDetailProps {
  squad: Squad;
  onBack: () => void;
  onSquadUpdated: () => void;
}

export default function SquadDetail({ squad, onBack, onSquadUpdated }: SquadDetailProps) {
  const { user } = useAuth();
  const [members, setMembers] = useState<SquadMember[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddMember, setShowAddMember] = useState(false);
  const [addingMemberId, setAddingMemberId] = useState<string | null>(null);
  const [removingMemberId, setRemovingMemberId] = useState<string | null>(null);
  const [inviteCode, setInviteCode] = useState(squad.inviteCode);
  const [copiedCode, setCopiedCode] = useState(false);
  const [regeneratingCode, setRegeneratingCode] = useState(false);

  const isOwner = squad.role === 'owner';
  const isAdmin = squad.role === 'admin' || isOwner;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await squadsApi.getOne(squad.id);
      if (res.success && res.data) {
        setMembers(res.data.members);
      }

      // Fetch friends for adding
      if (isAdmin) {
        const friendsRes = await friendsApi.getAll();
        if (friendsRes.success && friendsRes.data) {
          setFriends(friendsRes.data);
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [squad.id, isAdmin]);

  const handleCopyCode = async () => {
    await navigator.clipboard.writeText(inviteCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRegenerateCode = async () => {
    setRegeneratingCode(true);
    const res = await squadsApi.regenerateInvite(squad.id);
    if (res.success && res.data) {
      setInviteCode(res.data.inviteCode);
    }
    setRegeneratingCode(false);
  };

  const handleAddMember = async (friendId: string) => {
    setAddingMemberId(friendId);
    const res = await squadsApi.addMember(squad.id, friendId);
    if (res.success && res.data) {
      // Refresh members list
      const squadRes = await squadsApi.getOne(squad.id);
      if (squadRes.success && squadRes.data) {
        setMembers(squadRes.data.members);
      }
      onSquadUpdated();
    }
    setAddingMemberId(null);
    setShowAddMember(false);
  };

  const handleRemoveMember = async (memberId: string) => {
    setRemovingMemberId(memberId);
    const res = await squadsApi.removeMember(squad.id, memberId);
    if (res.success) {
      setMembers(prev => prev.filter(m => m.user.id !== memberId));
      onSquadUpdated();
    }
    setRemovingMemberId(null);
  };

  const handleUpdateRole = async (memberId: string, newRole: 'admin' | 'member') => {
    const res = await squadsApi.updateMemberRole(squad.id, memberId, newRole);
    if (res.success) {
      setMembers(prev => prev.map(m =>
        m.user.id === memberId ? { ...m, role: newRole } : m
      ));
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Get friends not already in squad
  const availableFriends = friends.filter(
    f => !members.some(m => m.user.id === f.id)
  );

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={onBack}
            className="p-1 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">{squad.name}</h2>
            <p className="text-xs text-muted-foreground">{members.length} members</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowAddMember(true)}
              className="p-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg"
              title="Add member"
            >
              <UserPlus className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Invite Code */}
        {isAdmin && (
          <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-2">
            <span className="text-xs text-muted-foreground">Invite:</span>
            <code className="flex-1 text-sm font-mono text-foreground">{inviteCode}</code>
            <button
              onClick={handleCopyCode}
              className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
              title="Copy code"
            >
              {copiedCode ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={handleRegenerateCode}
              disabled={regeneratingCode}
              className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground disabled:opacity-50"
              title="Generate new code"
            >
              <RefreshCw className={`w-4 h-4 ${regeneratingCode ? 'animate-spin' : ''}`} />
            </button>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Add Friend to Squad</h3>
              <button
                onClick={() => setShowAddMember(false)}
                className="p-1 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 max-h-80 overflow-y-auto">
              {availableFriends.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  All your friends are already in this squad
                </p>
              ) : (
                <div className="space-y-2">
                  {availableFriends.map((friend) => (
                    <div
                      key={friend.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
                        {friend.avatarUrl ? (
                          <img src={friend.avatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          getInitials(friend.displayName)
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{friend.displayName}</p>
                        <p className="text-xs text-muted-foreground">@{friend.username}</p>
                      </div>
                      <button
                        onClick={() => handleAddMember(friend.id)}
                        disabled={addingMemberId === friend.id}
                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
                      >
                        {addingMemberId === friend.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Add'
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Members List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {members.map((member) => (
          <div
            key={member.user.id}
            className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border hover:border-primary/30 transition-colors"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold overflow-hidden">
                {member.user.avatarUrl ? (
                  <img src={member.user.avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  getInitials(member.user.displayName)
                )}
              </div>
              {member.role === 'owner' && (
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white p-0.5 rounded-full">
                  <Crown className="w-3 h-3" />
                </div>
              )}
              {member.role === 'admin' && (
                <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full">
                  <Shield className="w-3 h-3" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-foreground truncate">{member.user.displayName}</p>
                {member.user.id === user?.id && (
                  <span className="text-xs text-muted-foreground">(you)</span>
                )}
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Flame className="w-3 h-3 text-orange-500" />
                  {member.user.currentStreak}
                </span>
                <span>•</span>
                <span>{member.user.totalXp.toLocaleString()} XP</span>
              </div>
            </div>

            {/* Actions */}
            {isAdmin && member.user.id !== user?.id && member.role !== 'owner' && (
              <div className="flex items-center gap-1">
                {isOwner && (
                  <button
                    onClick={() => handleUpdateRole(member.user.id, member.role === 'admin' ? 'member' : 'admin')}
                    className={`p-1.5 rounded ${member.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
                    title={member.role === 'admin' ? 'Remove admin' : 'Make admin'}
                  >
                    <Shield className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleRemoveMember(member.user.id)}
                  disabled={removingMemberId === member.user.id}
                  className="p-1.5 hover:bg-red-500/10 rounded text-muted-foreground hover:text-red-500 disabled:opacity-50"
                  title="Remove member"
                >
                  {removingMemberId === member.user.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <UserMinus className="w-4 h-4" />
                  )}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
