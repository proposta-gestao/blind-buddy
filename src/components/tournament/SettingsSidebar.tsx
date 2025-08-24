import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MoneyInput } from "@/components/ui/money-input";
import { Textarea } from "@/components/ui/textarea";
import { Volume2, Bell, Timer, DollarSign, X } from "lucide-react";
import { TournamentStructure } from "@/types/tournament";
import { useState, useEffect } from "react";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentStructure: TournamentStructure;
  onUpdateStructure: (updates: Partial<TournamentStructure>) => void;
}

export function SettingsSidebar({ isOpen, onClose, currentStructure, onUpdateStructure }: SettingsSidebarProps) {
  const [name, setName] = useState(currentStructure.name);
  const [description, setDescription] = useState(currentStructure.description);
  const [buyIn, setBuyIn] = useState(currentStructure.buyIn);
  const [doubleBuyIn, setDoubleBuyIn] = useState(currentStructure.doubleBuyIn);
  const [adminFee, setAdminFee] = useState(currentStructure.adminFee);
  const [guaranteedPrize, setGuaranteedPrize] = useState(currentStructure.guaranteedPrize);
  const [startingChips, setStartingChips] = useState(currentStructure.startingChips);
  const [doubleBuyInChips, setDoubleBuyInChips] = useState(currentStructure.doubleBuyInChips || currentStructure.startingChips * 2);
  const [addonChips, setAddonChips] = useState(currentStructure.addonChips || currentStructure.startingChips);
  const [adminFeeChips, setAdminFeeChips] = useState(currentStructure.adminFeeChips || 1000);
  const [breakDuration, setBreakDuration] = useState(currentStructure.breakDuration || 15);

  // Auto-calculate double buy-in when buy-in changes
  useEffect(() => {
    setDoubleBuyIn(buyIn * 2);
  }, [buyIn]);

  // Auto-calculate double buy-in chips when starting chips change
  useEffect(() => {
    setDoubleBuyInChips(startingChips * 2);
  }, [startingChips]);

  const handleSave = () => {
    onUpdateStructure({
      name,
      description,
      buyIn,
      doubleBuyIn,
      adminFee,
      guaranteedPrize,
      startingChips,
      doubleBuyInChips,
      addonChips,
      adminFeeChips,
      breakDuration
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-96 p-0">
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2">
            <Timer className="w-5 h-5 text-primary" />
            Configurações
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-80px)]">
          <div className="p-4 space-y-6">
            {/* Tournament Info */}
            <Card className="p-4 bg-gradient-felt border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-medium">Informações do Torneio</Label>
                </div>
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="tournament-name" className="text-xs">Nome do Torneio</Label>
                    <Input
                      id="tournament-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-8"
                      placeholder="Nome do torneio..."
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="tournament-description" className="text-xs">Descrição</Label>
                    <Textarea
                      id="tournament-description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="min-h-[60px] resize-none"
                      placeholder="Descrição do torneio..."
                    />
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
                  <Label htmlFor="guaranteed-prize" className="text-xs">Valor Garantido do Campeonato</Label>
                  <MoneyInput
                    id="guaranteed-prize"
                    value={guaranteedPrize}
                    onChange={setGuaranteedPrize}
                    className="h-8"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="buy-in" className="text-xs">Buy-in</Label>
                    <MoneyInput
                      id="buy-in"
                      value={buyIn}
                      onChange={setBuyIn}
                      className="h-8"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="double-buy-in" className="text-xs">Buy-in Duplo</Label>
                    <MoneyInput
                      id="double-buy-in"
                      value={doubleBuyIn}
                      onChange={setDoubleBuyIn}
                      className="h-8"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-fee" className="text-xs">Taxa Admin</Label>
                    <MoneyInput
                      id="admin-fee"
                      value={adminFee}
                      onChange={setAdminFee}
                      className="h-8"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="starting-chips" className="text-xs">Buy-in Simples</Label>
                      <MoneyInput
                        id="starting-chips"
                        value={startingChips}
                        onChange={setStartingChips}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="double-buyin-chips" className="text-xs">Buy-in Duplo</Label>
                      <MoneyInput
                        id="double-buyin-chips"
                        value={doubleBuyInChips}
                        onChange={setDoubleBuyInChips}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="addon-chips" className="text-xs">Addon</Label>
                      <MoneyInput
                        id="addon-chips"
                        value={addonChips}
                        onChange={setAddonChips}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-fee-chips" className="text-xs">Taxa Admin (Fichas)</Label>
                      <MoneyInput
                        id="admin-fee-chips"
                        value={adminFeeChips}
                        onChange={setAdminFeeChips}
                        className="h-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="break-duration" className="text-xs">Tempo de Pausa (min)</Label>
                    <Input
                      id="break-duration"
                      type="number"
                      value={breakDuration}
                      onChange={(e) => setBreakDuration(Number(e.target.value))}
                      className="h-8"
                      min="1"
                      max="60"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Audio Settings */}
            <Card className="p-4 bg-gradient-felt border-primary/20">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-primary" />
                  <Label className="text-sm font-medium">Áudio</Label>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound-enabled" className="text-xs">
                      Sons Ativados
                    </Label>
                    <Switch id="sound-enabled" defaultChecked />
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-xs">Volume dos Alertas</Label>
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
                    <Label htmlFor="notify-5min" className="text-xs">
                      Aviso aos 5 minutos
                    </Label>
                    <Switch id="notify-5min" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-1min" className="text-xs">
                      Aviso ao 1 minuto
                    </Label>
                    <Switch id="notify-1min" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="notify-final" className="text-xs">
                      Contagem regressiva final
                    </Label>
                    <Switch id="notify-final" defaultChecked />
                  </div>
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
                    <Label htmlFor="auto-breaks" className="text-xs">
                      Pausas automáticas
                    </Label>
                    <Switch id="auto-breaks" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-next" className="text-xs">
                      Mostrar próximo nível
                    </Label>
                    <Switch id="show-next" defaultChecked />
                  </div>
                </div>
              </div>
            </Card>
            
            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={onClose} className="flex-1 h-8">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1 h-8">
                Salvar
              </Button>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}