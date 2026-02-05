
import { Users, Plus, Settings } from 'lucide-react';
import { Squad, mockSquads } from '../../data/mockSocial';

interface SquadListProps {
    onSelectSquad: (squad: Squad) => void;
    selectedSquadId?: string;
}

export default function SquadList({ onSelectSquad, selectedSquadId }: SquadListProps) {
    return (
        <div className="bg-card border border-border rounded-xl h-full flex flex-col">
            <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-foreground">Your Squads</h2>
                <button className="text-primary hover:text-primary/80 transition-colors">
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-2">
                {mockSquads.map((squad) => (
                    <button
                        key={squad.id}
                        onClick={() => onSelectSquad(squad)}
                        className={`w-full text-left p-3 rounded-lg border transition-colors ${selectedSquadId === squad.id
                                ? 'bg-primary/10 border-primary'
                                : 'bg-background border-border hover:border-primary/50'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium text-foreground">{squad.name}</h3>
                            <Users className="w-4 h-4 text-muted-foreground" />
                        </div>

                        <div className="flex items-center -space-x-2">
                            {squad.members.map((member, i) => (
                                <div
                                    key={member.id}
                                    className="w-6 h-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] text-secondary-foreground font-bold"
                                    style={{ zIndex: squad.members.length - i }}
                                >
                                    {member.avatar}
                                </div>
                            ))}
                            <div className="w-6 h-6 rounded-full bg-secondary border-2 border-background flex items-center justify-center text-[10px] text-secondary-foreground font-bold" style={{ zIndex: 0 }}>
                                +1
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
