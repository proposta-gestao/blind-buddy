import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trash2, Trophy, Users } from "lucide-react";
import { Player } from "@/types/tournament";

interface PlayerManagerProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onRemovePlayer: (playerId: string) => void;
  onEliminatePlayer: (playerId: string) => void;
}

export function PlayerManager({
  isOpen,
  onClose,
  players,
  onAddPlayer,
  onRemovePlayer,
  onEliminatePlayer
}: PlayerManagerProps) {
  const [newPlayerName, setNewPlayerName] = useState("");

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer({
        name: newPlayerName.trim(),
        isEliminated: false,
        chips: 0,
        rebuys: 0,
        addons: 0
      });
      setNewPlayerName("");
    }
  };

  const activePlayers = players.filter(p => !p.isEliminated);
  const eliminatedPlayers = players.filter(p => p.isEliminated);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gerenciamento de Jogadores
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto">
          {/* Add Player */}
          <Card className="p-4">
            <div className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="playerName">Nome do Jogador</Label>
                <Input
                  id="playerName"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Digite o nome do jogador..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddPlayer} variant="chip">
                  <UserPlus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{players.length}</div>
              <div className="text-sm text-muted-foreground">Total de Jogadores</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-poker-chip">{activePlayers.length}</div>
              <div className="text-sm text-muted-foreground">Jogadores Ativos</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">{eliminatedPlayers.length}</div>
              <div className="text-sm text-muted-foreground">Eliminados</div>
            </Card>
          </div>

          {/* Active Players */}
          {activePlayers.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-poker-chip" />
                Jogadores Ativos ({activePlayers.length})
              </h3>
              <div className="space-y-2">
                {activePlayers.map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{player.name}</span>
                      <Badge variant="secondary">Ativo</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => onEliminatePlayer(player.id)}
                        variant="destructive"
                        size="sm"
                      >
                        Eliminar
                      </Button>
                      <Button
                        onClick={() => onRemovePlayer(player.id)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Eliminated Players */}
          {eliminatedPlayers.length > 0 && (
            <Card className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-destructive" />
                Jogadores Eliminados ({eliminatedPlayers.length})
              </h3>
              <div className="space-y-2">
                {eliminatedPlayers
                  .sort((a, b) => (b.position || 0) - (a.position || 0))
                  .map((player) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-muted-foreground">{player.name}</span>
                      <Badge variant="destructive">
                        {player.position ? `${player.position}º lugar` : 'Eliminado'}
                      </Badge>
                    </div>
                    <Button
                      onClick={() => onRemovePlayer(player.id)}
                      variant="outline"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {players.length === 0 && (
            <Card className="p-8 text-center">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhum jogador registrado ainda.
                <br />
                Adicione jogadores para começar o torneio.
              </p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}