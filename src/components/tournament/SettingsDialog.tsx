import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Volume2, Bell, Timer, DollarSign } from "lucide-react";
import { TournamentStructure } from "@/types/tournament";
import { useState } from "react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentStructure: TournamentStructure;
  onUpdateStructure: (updates: Partial<TournamentStructure>) => void;
}

export function SettingsDialog({ isOpen, onClose, currentStructure, onUpdateStructure }: SettingsDialogProps) {
  const [buyIn, setBuyIn] = useState(currentStructure.buyIn);
  const [doubleBuyIn, setDoubleBuyIn] = useState(currentStructure.doubleBuyIn);
  const [adminFee, setAdminFee] = useState(currentStructure.adminFee);
  const [adminFeeChips, setAdminFeeChips] = useState(currentStructure.adminFeeChips);
  const [guaranteedPrize, setGuaranteedPrize] = useState(currentStructure.guaranteedPrize);
  const [startingChips, setStartingChips] = useState(currentStructure.startingChips);

  const handleSave = () => {
    onUpdateStructure({
      buyIn,
      doubleBuyIn,
      adminFee,
      adminFeeChips,
      guaranteedPrize,
      startingChips
    });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5" />
            Configurações do Torneio
          </DialogTitle>
          <DialogDescription>
            Personalize as configurações do torneio conforme sua preferência.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Audio Settings */}
          <Card className="p-4 bg-gradient-felt border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-primary" />
                <Label className="text-sm font-medium">Áudio</Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="sound-enabled" className="text-sm">
                    Sons Ativados
                  </Label>
                  <Switch id="sound-enabled" defaultChecked />
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm">Volume dos Alertas</Label>
                  <Slider
                    defaultValue={[70]}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-4 bg-gradient-felt border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary" />
                <Label className="text-sm font-medium">Notificações</Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-5min" className="text-sm">
                    Aviso aos 5 minutos
                  </Label>
                  <Switch id="notify-5min" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-1min" className="text-sm">
                    Aviso ao 1 minuto
                  </Label>
                  <Switch id="notify-1min" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="notify-final" className="text-sm">
                    Contagem regressiva final
                  </Label>
                  <Switch id="notify-final" defaultChecked />
                </div>
              </div>
            </div>
          </Card>

          {/* Tournament Values */}
          <Card className="p-4 bg-gradient-felt border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-primary" />
                <Label className="text-sm font-medium">Valores do Torneio</Label>
              </div>
              
              {/* Guaranteed Prize - First Line */}
              <div className="space-y-2">
                <Label htmlFor="guaranteed-prize" className="text-sm">Valor Garantido do Campeonato</Label>
                <Input
                  id="guaranteed-prize"
                  type="number"
                  value={guaranteedPrize}
                  onChange={(e) => setGuaranteedPrize(Number(e.target.value))}
                  className="h-8"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="buy-in" className="text-sm">Buy-in</Label>
                  <Input
                    id="buy-in"
                    type="number"
                    value={buyIn}
                    onChange={(e) => setBuyIn(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="double-buy-in" className="text-sm">Buy-in Duplo</Label>
                  <Input
                    id="double-buy-in"
                    type="number"
                    value={doubleBuyIn}
                    onChange={(e) => setDoubleBuyIn(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-fee" className="text-sm">Taxa Admin</Label>
                  <Input
                    id="admin-fee"
                    type="number"
                    value={adminFee}
                    onChange={(e) => setAdminFee(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="admin-fee-chips" className="text-sm">Fichas Taxa Admin</Label>
                  <Input
                    id="admin-fee-chips"
                    type="number"
                    value={adminFeeChips}
                    onChange={(e) => setAdminFeeChips(Number(e.target.value))}
                    className="h-8"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="starting-chips" className="text-sm">Fichas Iniciais</Label>
                <Input
                  id="starting-chips"
                  type="number"
                  value={startingChips}
                  onChange={(e) => setStartingChips(Number(e.target.value))}
                  className="h-8"
                />
              </div>
            </div>
          </Card>

          {/* Timer Settings */}
          <Card className="p-4 bg-gradient-felt border-primary/20">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-primary" />
                <Label className="text-sm font-medium">Timer</Label>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="auto-breaks" className="text-sm">
                    Pausas automáticas
                  </Label>
                  <Switch id="auto-breaks" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="show-next" className="text-sm">
                    Mostrar próximo nível
                  </Label>
                  <Switch id="show-next" defaultChecked />
                </div>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}