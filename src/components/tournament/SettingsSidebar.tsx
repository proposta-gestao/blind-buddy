import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Volume2, Bell, Timer, DollarSign, X } from "lucide-react";
import { TournamentStructure } from "@/types/tournament";
import { useState } from "react";

interface SettingsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentStructure: TournamentStructure;
  onUpdateStructure: (updates: Partial<TournamentStructure>) => void;
}

export function SettingsSidebar({ isOpen, onClose, currentStructure, onUpdateStructure }: SettingsSidebarProps) {
  const [buyIn, setBuyIn] = useState(currentStructure.buyIn);
  const [doubleBuyIn, setDoubleBuyIn] = useState(currentStructure.doubleBuyIn);
  const [adminFee, setAdminFee] = useState(currentStructure.adminFee);
  const [guaranteedPrize, setGuaranteedPrize] = useState(currentStructure.guaranteedPrize);
  const [startingChips, setStartingChips] = useState(currentStructure.startingChips);

  const handleSave = () => {
    onUpdateStructure({
      buyIn,
      doubleBuyIn,
      adminFee,
      guaranteedPrize,
      startingChips
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-background border-l border-border shadow-lg animate-slide-in-right">
      <Sidebar className="w-full h-full">
        <SidebarHeader className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">Configurações</h2>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SidebarHeader>

        <SidebarContent>
          <ScrollArea className="h-full">
            <div className="p-4 space-y-6">
              {/* Tournament Values */}
              <Card className="p-4 bg-gradient-felt border-primary/20">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-primary" />
                    <Label className="text-sm font-medium">Valores do Torneio</Label>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor="buy-in" className="text-xs">Buy-in</Label>
                      <Input
                        id="buy-in"
                        type="number"
                        value={buyIn}
                        onChange={(e) => setBuyIn(Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="double-buy-in" className="text-xs">Buy-in Duplo</Label>
                      <Input
                        id="double-buy-in"
                        type="number"
                        value={doubleBuyIn}
                        onChange={(e) => setDoubleBuyIn(Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="admin-fee" className="text-xs">Taxa Admin</Label>
                      <Input
                        id="admin-fee"
                        type="number"
                        value={adminFee}
                        onChange={(e) => setAdminFee(Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="guaranteed-prize" className="text-xs">Garantido</Label>
                      <Input
                        id="guaranteed-prize"
                        type="number"
                        value={guaranteedPrize}
                        onChange={(e) => setGuaranteedPrize(Number(e.target.value))}
                        className="h-8"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="starting-chips" className="text-xs">Fichas Iniciais</Label>
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
        </SidebarContent>
      </Sidebar>
    </div>
  );
}