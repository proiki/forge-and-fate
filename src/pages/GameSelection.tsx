import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Crown, Users, Dice6, MapPin } from "lucide-react";
import { toast } from "sonner";
import heroBanner from "@/assets/hero-banner.jpg";

interface GameSelectionProps {
  onSelectRole: (role: 'gm' | 'player', roomCode?: string) => void;
}

export const GameSelection = ({ onSelectRole }: GameSelectionProps) => {
  const [roomCode, setRoomCode] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);

  const handleCreateRoom = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    toast.success(`Mesa criada! Código: ${code}`);
    onSelectRole('gm', code);
  };

  const handleJoinRoom = () => {
    if (!roomCode.trim()) {
      toast.error("Digite um código válido!");
      return;
    }
    toast.success(`Entrando na mesa: ${roomCode}`);
    onSelectRole('player', roomCode);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBanner})` }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-magic-water rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-magic-fire rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-magic-earth rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4 animate-glow-pulse">
            Forge & Fate
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Entre no mundo épico dos RPGs online. Crie lendas, forje destinos e viva aventuras inesquecíveis.
          </p>
        </div>

        {/* Role Selection */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Escolha seu Destino
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Game Master Card */}
            <Card className="bg-gradient-card border-primary/30 shadow-epic hover:shadow-glow transition-all duration-500 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Crown className="w-10 h-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl text-foreground">Mestre da Mesa</CardTitle>
                <p className="text-muted-foreground">Conduza épicas aventuras e crie mundos fantásticos</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Crie mapas 2D e 3D personalizados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Controle NPCs, monstros e cenários</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dice6 className="w-4 h-4 text-primary" />
                    <span>Sistema avançado de dados e regras</span>
                  </div>
                </div>
                <Button 
                  variant="hero" 
                  size="xl" 
                  className="w-full"
                  onClick={handleCreateRoom}
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Criar Mesa
                </Button>
              </CardContent>
            </Card>

            {/* Player Card */}
            <Card className="bg-gradient-card border-primary/30 shadow-epic hover:shadow-glow transition-all duration-500 group cursor-pointer">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-20 h-20 bg-gradient-magic rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-foreground">Jogador</CardTitle>
                <p className="text-muted-foreground">Viva aventuras épicas com personagens únicos</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary" />
                    <span>Múltiplos personagens personalizados</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Dice6 className="w-4 h-4 text-primary" />
                    <span>Sistema de cartas e habilidades</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>Explore mundos épicos</span>
                  </div>
                </div>
                {!showJoinForm ? (
                  <Button 
                    variant="magic" 
                    size="xl" 
                    className="w-full"
                    onClick={() => setShowJoinForm(true)}
                  >
                    <Users className="w-5 h-5 mr-2" />
                    Entrar em Mesa
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="roomCode" className="text-foreground">Código da Mesa</Label>
                      <Input
                        id="roomCode"
                        placeholder="Digite o código da mesa..."
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                        className="bg-muted border-primary/30 focus:border-primary"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="magic" 
                        onClick={handleJoinRoom}
                        className="flex-1"
                      >
                        Entrar
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowJoinForm(false)}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 opacity-80">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-magic-fire/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Dice6 className="w-6 h-6 text-magic-fire" />
              </div>
              <h3 className="font-semibold text-foreground">Sistema de Dados</h3>
              <p className="text-xs text-muted-foreground">D4 até D100</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-magic-water/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <MapPin className="w-6 h-6 text-magic-water" />
              </div>
              <h3 className="font-semibold text-foreground">Mapas Dinâmicos</h3>
              <p className="text-xs text-muted-foreground">2D e 3D</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-magic-earth/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-magic-earth" />
              </div>
              <h3 className="font-semibold text-foreground">Multiplayer</h3>
              <p className="text-xs text-muted-foreground">Até 1000 elementos</p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Crown className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Sistema Épico</h3>
              <p className="text-xs text-muted-foreground">Cartas e evoluções</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};