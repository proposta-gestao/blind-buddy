import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Volume2, Bell, Timer } from "lucide-react";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
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
      </DialogContent>
    </Dialog>
  );
}