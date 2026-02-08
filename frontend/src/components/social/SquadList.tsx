import { useState, useEffect } from 'react';
import { Users, Plus, Loader2, X, Link } from 'lucide-react';
import { squadsApi, type Squad } from '../../services/api';
import SquadDetail from './SquadDetail';

interface SquadListProps {
  onSelectSquad?: (squad: Squad) => void;
  selectedSquadId?: string;
}

export default function SquadList({ onSelectSquad, selectedSquadId }: SquadListProps) {
  const [squads, setSquads] = useState<Squad[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [newSquadName, setNewSquadName] = useState('');
  const [newSquadDescription, setNewSquadDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSquads = async () => {
    setLoading(true);
    const res = await squadsApi.getAll();
    if (res.success && res.data) {
      setSquads(res.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSquads();
  }, []);

  const handleCreateSquad = async () => {
    if (!newSquadName.trim()) return;

    setCreating(true);
    setError(null);

    const res = await squadsApi.create({
      name: newSquadName.trim(),
      description: newSquadDescription.trim() || undefined,
    });

    if (res.success && res.data) {
      setSquads(prev => [...prev, res.data!]);
      setShowCreateModal(false);
      setNewSquadName('');
      setNewSquadDescription('');
    } else {
      setError(res.error || 'Failed to create squad');
    }
    setCreating(false);
  };

  const handleJoinSquad = async () => {
    if (!joinCode.trim()) return;

    setJoining(true);
    setError(null);

    const res = await squadsApi.join(joinCode.trim());

    if (res.success && res.data) {
      await fetchSquads();
      setShowJoinModal(false);
      setJoinCode('');
    } else {
      setError(res.error || 'Invalid invite code');
    }
    setJoining(false);
  };

  const handleSquadClick = (squad: Squad) => {
    setSelectedSquad(squad);
    if (onSelectSquad) {
      onSelectSquad(squad);
    }
  };

  // Show squad detail view
  if (selectedSquad) {
    return (
      <SquadDetail
        squad={selectedSquad}
        onBack={() => setSelectedSquad(null)}
        onSquadUpdated={fetchSquads}
      />
    );
  }

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl h-full flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl h-full flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="font-semibold text-foreground">Your Squads</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowJoinModal(true)}
            className="p-1.5 hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground"
            title="Join with code"
          >
            <Link className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="text-primary hover:text-primary/80 transition-colors"
            title="Create squad"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Create Squad Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Create Squad</h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setError(null);
                }}
                className="p-1 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Squad Name</label>
                <input
                  type="text"
                  value={newSquadName}
                  onChange={(e) => setNewSquadName(e.target.value)}
                  placeholder="e.g., Morning Crew"
                  className="w-full bg-secondary text-foreground rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Description (optional)</label>
                <textarea
                  value={newSquadDescription}
                  onChange={(e) => setNewSquadDescription(e.target.value)}
                  placeholder="What's your squad about?"
                  rows={3}
                  className="w-full bg-secondary text-foreground rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
              <button
                onClick={handleCreateSquad}
                disabled={!newSquadName.trim() || creating}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Squad'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Join Squad Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-semibold text-foreground">Join Squad</h3>
              <button
                onClick={() => {
                  setShowJoinModal(false);
                  setError(null);
                  setJoinCode('');
                }}
                className="p-1 hover:bg-secondary rounded-lg"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Invite Code</label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder="Enter invite code"
                  className="w-full bg-secondary text-foreground rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                />
              </div>
              <button
                onClick={handleJoinSquad}
                disabled={!joinCode.trim() || joining}
                className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {joining ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Joining...
                  </>
                ) : (
                  'Join Squad'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {squads.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p>No squads yet</p>
            <p className="text-xs mt-1">Create one or join with an invite code</p>
          </div>
        ) : (
          squads.map((squad) => (
            <button
              key={squad.id}
              onClick={() => handleSquadClick(squad)}
              className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedSquadId === squad.id
                ? 'bg-primary/10 border-primary'
                : 'bg-background border-border hover:border-primary/50'
                }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-foreground">{squad.name}</h3>
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{squad.memberCount} members</span>
                {squad.role && (
                  <span className={`px-1.5 py-0.5 rounded ${
                    squad.role === 'owner' ? 'bg-yellow-500/10 text-yellow-500' :
                    squad.role === 'admin' ? 'bg-blue-500/10 text-blue-500' : ''
                  }`}>
                    {squad.role}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
