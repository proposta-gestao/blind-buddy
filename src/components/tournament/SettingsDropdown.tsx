import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { MoneyInput } from "@/components/ui/money-input";
import { Textarea } from "@/components/ui/textarea";
import { Settings, ChevronDown, ChevronUp, DollarSign, Timer } from "lucide-react";
import { TournamentStructure } from "@/types/tournament";
import { useState, useEffect } from "react";

interface SettingsDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  currentStructure: TournamentStructure;
  onUpdateStructure: (updates: Partial<TournamentStructure>) => void;
}

export function SettingsDropdown({ 
  isOpen, 
  onToggle, 
  currentStructure, 
  onUpdateStructure 
}: SettingsDropdownProps) {
  const [name, setName] = useState(currentStructure.name);
  const [description, setDescription] = useState(currentStructure.description);
  const [guaranteedPrize, setGuaranteedPrize] = useState(currentStructure.guaranteedPrize);
  const [buyIn, setBuyIn] = useState(currentStructure.buyIn);
  const [doubleBuyIn, setDoubleBuyIn] = useState(currentStructure.doubleBuyIn);
  const [adminFee, setAdminFee] = useState(currentStructure.adminFee);
  const [addon, setAddon] = useState(currentStructure.addon || 0);
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
      guaranteedPrize,
      buyIn,
      doubleBuyIn,
      adminFee,
      addon,
      startingChips,
      doubleBuyInChips,
      addonChips,
      adminFeeChips,
      breakDuration
    });
    onToggle();
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="secondary" 
          size="default"
          className="w-full justify-between"
        >
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Configurações
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="space-y-4 mt-4">
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
            
            {/* Values and Chips Side by Side */}
            <div className="space-y-4">
              {/* Buy-in Normal */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="buy-in" className="text-xs">Buy-in Normal (Valor)</Label>
                  <MoneyInput
                    id="buy-in"
                    value={buyIn}
                    onChange={setBuyIn}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="starting-chips" className="text-xs">Buy-in Normal (Fichas)</Label>
                  <MoneyInput
                    id="starting-chips"
                    value={startingChips}
                    onChange={setStartingChips}
                    className="h-8"
                  />
                </div>
              </div>

              {/* Buy-in Duplo */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="double-buy-in" className="text-xs">Buy-in Duplo (Valor)</Label>
                  <MoneyInput
                    id="double-buy-in"
                    value={doubleBuyIn}
                    onChange={setDoubleBuyIn}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="double-buyin-chips" className="text-xs">Buy-in Duplo (Fichas)</Label>
                  <MoneyInput
                    id="double-buyin-chips"
                    value={doubleBuyInChips}
                    onChange={setDoubleBuyInChips}
                    className="h-8"
                  />
                </div>
              </div>

              {/* Addon */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="addon" className="text-xs">Addon (Valor)</Label>
                  <MoneyInput
                    id="addon"
                    value={addon}
                    onChange={setAddon}
                    className="h-8"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="addon-chips" className="text-xs">Addon (Fichas)</Label>
                  <MoneyInput
                    id="addon-chips"
                    value={addonChips}
                    onChange={setAddonChips}
                    className="h-8"
                  />
                </div>
              </div>

              {/* Taxa Admin */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="admin-fee" className="text-xs">Taxa Admin (Valor)</Label>
                  <MoneyInput
                    id="admin-fee"
                    value={adminFee}
                    onChange={setAdminFee}
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
        </Card>
        
        <div className="flex gap-2 pt-4">
          <Button variant="outline" onClick={onToggle} className="flex-1 h-8">
            Cancelar
          </Button>
          <Button onClick={handleSave} className="flex-1 h-8">
            Salvar
          </Button>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}