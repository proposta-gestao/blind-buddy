import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Play, Trophy, Users, Settings, Clock, Monitor } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-felt border-b border-primary/20">
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-chip rounded-full p-6 shadow-chip">
              <Trophy className="w-16 h-16 text-accent-foreground" />
            </div>
          </div>
          <h1 className="text-display font-bold text-foreground mb-4">
            Sistema de Gestão de Poker
          </h1>
          <p className="text-subtitle text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistema profissional para gerenciamento de torneios de poker com interface moderna, 
            timer avançado e controle completo de blinds e jogadores.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/tournament')} 
              variant="chip" 
              size="xl"
              className="shadow-chip"
            >
              <Settings className="w-6 h-6" />
              Gerenciar Torneio
            </Button>
            <Button 
              onClick={() => navigate('/tournament/display')} 
              variant="timer" 
              size="xl"
              className="shadow-chip"
            >
              <Monitor className="w-6 h-6" />
              Visualizar Torneio
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-title font-bold text-center mb-12 text-foreground">
          Funcionalidades Profissionais
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-gradient-felt border-primary/20 shadow-poker p-6 text-center">
            <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">Timer Profissional</h3>
            <p className="text-muted-foreground">
              Controle preciso de tempo com alertas sonoros e visuais para mudanças de nível
            </p>
          </Card>

          <Card className="bg-gradient-felt border-primary/20 shadow-poker p-6 text-center">
            <Trophy className="w-12 h-12 text-poker-chip mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">Estruturas Pré-definidas</h3>
            <p className="text-muted-foreground">
              Torneios Turbo, Regular e Deep Stack com estruturas otimizadas
            </p>
          </Card>

          <Card className="bg-gradient-felt border-primary/20 shadow-poker p-6 text-center">
            <Users className="w-12 h-12 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">Gestão de Jogadores</h3>
            <p className="text-muted-foreground">
              Controle completo de participantes, eliminações e classificações finais
            </p>
          </Card>

          <Card className="bg-gradient-felt border-primary/20 shadow-poker p-6 text-center">
            <Settings className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2 text-foreground">Interface Responsiva</h3>
            <p className="text-muted-foreground">
              Design otimizado para desktop, tablet e projeção em tela grande
            </p>
          </Card>

          <Card className="bg-gradient-felt border-primary/20 shadow-poker p-6 text-center">
            <div className="w-12 h-12 bg-gradient-timer rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-xl font-bold text-primary-foreground">BB</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Controle de Blinds</h3>
            <p className="text-muted-foreground">
              Gestão automática de Small Blind, Big Blind e Ante com progressão personalizada
            </p>
          </Card>

          <Card className="bg-gradient-felt border-primary/20 shadow-poker p-6 text-center">
            <div className="w-12 h-12 bg-poker-chip rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-lg font-bold text-accent-foreground">$</span>
            </div>
            <h3 className="text-lg font-bold mb-2 text-foreground">Prize Pool</h3>
            <p className="text-muted-foreground">
              Cálculo automático de premiação e estatísticas em tempo real
            </p>
          </Card>
        </div>
      </div>

      {/* Quick Start */}
      <div className="bg-card/50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h2 className="text-title font-bold mb-8 text-foreground">
            Comece Seu Torneio Agora
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
              <span>Selecione a estrutura do torneio</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
              <span>Registre os jogadores</span>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
              <span>Inicie o timer e comece a jogar!</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/tournament')} 
              variant="timer" 
              size="xl"
            >
              <Settings className="w-6 h-6" />
              Gerenciar Torneio
            </Button>
            <Button 
              onClick={() => navigate('/tournament/display')} 
              variant="chip" 
              size="xl"
            >
              <Monitor className="w-6 h-6" />
              Visualizar Torneio
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
