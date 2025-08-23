import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserPlus, Trash2, Trophy, Users, X } from "lucide-react";
import { Player } from "@/types/tournament";

interface PlayerSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  players: Player[];
  onAddPlayer: (player: Omit<Player, 'id'>) => void;
  onRemovePlayer: (playerId: string) => void;
  onEliminatePlayer: (playerId: string) => void;
}

export function PlayerSidebar({
  isOpen,
  onClose,
  players,
  onAddPlayer,
  onRemovePlayer,
  onEliminatePlayer
}: PlayerSidebarProps) {
  const [newPlayerName, setNewPlayerName] = useState("");
  const [buyInType, setBuyInType] = useState<'normal' | 'double'>('normal');
  const [paidAdminFee, setPaidAdminFee] = useState(false);

  const handleAddPlayer = () => {
    if (newPlayerName.trim()) {
      onAddPlayer({
        name: newPlayerName.trim(),
        isEliminated: false,
        chips: 0,
        rebuys: 0,
        addons: 0,
        buyInType,
        paidAdminFee
      });
      setNewPlayerName("");
      setBuyInType('normal');
      setPaidAdminFee(false);
    }
  };

  const activePlayers = players.filter(p => !p.isEliminated);
  const eliminatedPlayers = players.filter(p => p.isEliminated);

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Gerenciar Jogadores
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-6">
            {/* Add Player */}
            <Card className="p-4 bg-gradient-felt border-primary/20">
              <div className="space-y-4">
                <h3 className="font-medium text-sm">Adicionar Jogador</h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="playerName" className="text-xs">Nome do Jogador</Label>
                    <Input
                      id="playerName"
                      value={newPlayerName}
                      onChange={(e) => setNewPlayerName(e.target.value)}
                      placeholder="Nome..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddPlayer()}
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Tipo de Buy-in</Label>
                    <Select value={buyInType} onValueChange={(value: 'normal' | 'double') => setBuyInType(value)}>
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-background border border-border z-[60]">
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="double">Duplo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="adminFee" 
                      checked={paidAdminFee}
                      onCheckedChange={(checked) => setPaidAdminFee(!!checked)}
                    />
                    <Label htmlFor="adminFee" className="text-xs">Taxa administrativa</Label>
                  </div>
                  <Button onClick={handleAddPlayer} variant="chip" className="w-full h-8">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>
              </div>
            </Card>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2">
              <Card className="p-3 text-center bg-gradient-felt border-primary/20">
                <div className="text-xl font-bold text-primary">{players.length}</div>
                <div className="text-xs text-muted-foreground">Total</div>
              </Card>
              <Card className="p-3 text-center bg-gradient-felt border-primary/20">
                <div className="text-xl font-bold text-poker-chip">{activePlayers.length}</div>
                <div className="text-xs text-muted-foreground">Ativos</div>
              </Card>
              <Card className="p-3 text-center bg-gradient-felt border-primary/20">
                <div className="text-xl font-bold text-destructive">{eliminatedPlayers.length}</div>
                <div className="text-xs text-muted-foreground">Eliminados</div>
              </Card>
            </div>

            {/* Active Players */}
            {activePlayers.length > 0 && (
              <Card className="p-4 bg-gradient-felt border-primary/20">
                <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-poker-chip" />
                  Jogadores Ativos ({activePlayers.length})
                </h3>
                <div className="space-y-2">
                  {activePlayers.map((player) => (
                    <div key={player.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{player.name}</span>
                        <div className="flex gap-1">
                          <Button
                            onClick={() => onEliminatePlayer(player.id)}
                            variant="destructive"
                            size="sm"
                            className="h-6 px-2 text-xs"
                          >
                            Eliminar
                          </Button>
                          <Button
                            onClick={() => onRemovePlayer(player.id)}
                            variant="outline"
                            size="sm"
                            className="h-6 px-2"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">Ativo</Badge>
                        <Badge variant={player.buyInType === 'double' ? 'default' : 'outline'} className="text-xs">
                          {player.buyInType === 'double' ? 'Duplo' : 'Normal'}
                        </Badge>
                        {player.paidAdminFee && (
                          <Badge variant="destructive" className="text-xs">Taxa</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Eliminated Players */}
            {eliminatedPlayers.length > 0 && (
              <Card className="p-4 bg-gradient-felt border-primary/20">
                <h3 className="font-medium text-sm mb-3 flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-destructive" />
                  Eliminados ({eliminatedPlayers.length})
                </h3>
                <div className="space-y-2">
                  {eliminatedPlayers
                    .sort((a, b) => (b.position || 0) - (a.position || 0))
                    .map((player) => (
                      <div key={player.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="space-y-1">
                          <span className="font-medium text-sm text-muted-foreground">{player.name}</span>
                          <Badge variant="destructive" className="text-xs">
                            {player.position ? `${player.position}º lugar` : 'Eliminado'}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => onRemovePlayer(player.id)}
                          variant="outline"
                          size="sm"
                          className="h-6 px-2"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                </div>
              </Card>
            )}

            {players.length === 0 && (
              <Card className="p-6 text-center bg-gradient-felt border-primary/20">
                <Users className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">
                  Nenhum jogador registrado.
                  <br />
                  Adicione jogadores para começar.
                </p>
              </Card>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}