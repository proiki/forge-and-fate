import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DiceRoller } from "@/components/DiceRoller";
import { CharacterCard } from "@/components/CharacterCard";
import { SpellCard } from "@/components/SpellCard";
import { 
  Crown, 
  Users, 
  MessageCircle, 
  Map, 
  Settings, 
  Plus,
  Send,
  Eye,
  Sword,
  LogOut
} from "lucide-react";
import { toast } from "sonner";

interface GameDashboardProps {
  role: 'gm' | 'player';
  roomCode: string;
  onLeaveGame: () => void;
}

export const GameDashboard = ({ role, roomCode, onLeaveGame }: GameDashboardProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [chatMessage, setChatMessage] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  // Mock data
  const mockCharacters = [
    {
      id: "1",
      name: "Aragorn",
      class: "Guerreiro",
      level: 15,
      hp: 180,
      maxHp: 200,
      mana: 50,
      maxMana: 50,
      attributes: { strength: 18, defense: 16, agility: 14, intelligence: 10, luck: 12 }
    },
    {
      id: "2", 
      name: "Gandalf",
      class: "Mago",
      level: 20,
      hp: 120,
      maxHp: 120,
      mana: 300,
      maxMana: 320,
      attributes: { strength: 8, defense: 10, agility: 12, intelligence: 20, luck: 15 }
    }
  ];

  const mockSpells = [
    {
      id: "1",
      name: "Bola de Fogo",
      level: 3,
      element: "Fogo",
      manaCost: 25,
      damage: 45,
      description: "Lança uma esfera flamejante que explode ao impacto.",
      strengths: ["Efetivo contra gelo", "Área de dano"],
      weaknesses: ["Resistido por água", "Alto custo"],
      synergies: ["Vento", "Terra"],
      evolutionChance: 15,
      rarity: "rare" as const
    },
    {
      id: "2",
      name: "Cura Divina",
      level: 5,
      element: "Luz",
      manaCost: 40,
      heal: 80,
      description: "Invoca a luz divina para curar ferimentos.",
      strengths: ["Cura poderosa", "Remove debuffs"],
      weaknesses: ["Não funciona em mortos-vivos"],
      synergies: ["Água", "Terra"],
      evolutionChance: 25,
      rarity: "epic" as const
    }
  ];

  const chatMessages = [
    { id: 1, user: "GM", message: "Bem-vindos à Taverna do Dragão Dourado!", timestamp: "14:30", type: "system" },
    { id: 2, user: "Aragorn", message: "Vou investigar as pegadas suspeitas.", timestamp: "14:32", type: "player" },
    { id: 3, user: "GM", message: "Role um teste de Investigação (D20).", timestamp: "14:33", type: "gm" }
  ];

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    toast.success("Mensagem enviada!");
    setChatMessage("");
  };

  const handleCharacterSelect = (character: any) => {
    setSelectedCharacter(character);
    toast.success(`Personagem ${character.name} selecionado!`);
  };

  const handleSpellCast = (spell: any) => {
    toast.success(`${spell.name} foi lançado!`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {role === 'gm' ? (
                  <Crown className="w-6 h-6 text-primary" />
                ) : (
                  <Users className="w-6 h-6 text-primary" />
                )}
                <h1 className="text-xl font-bold text-foreground">
                  {role === 'gm' ? 'Mesa do Mestre' : 'Mesa de Jogo'}
                </h1>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                Sala: {roomCode}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-accent">
                <Users className="w-4 h-4 mr-1" />
                3 jogadores online
              </Badge>
              <Button variant="outline" size="sm" onClick={onLeaveGame}>
                <LogOut className="w-4 h-4 mr-1" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="characters">Personagens</TabsTrigger>
            <TabsTrigger value="spells">Magias</TabsTrigger>
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="dice">Dados</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-gradient-card border-primary/30 shadow-card">
                <CardHeader>
                  <CardTitle className="text-foreground flex items-center gap-2">
                    <Map className="w-5 h-5 text-primary" />
                    Área Atual: Taverna do Dragão Dourado
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                    <div className="text-center">
                      <Map className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Mapa da taverna será renderizado aqui</p>
                      {role === 'gm' && (
                        <Button variant="outline" className="mt-4">
                          <Settings className="w-4 h-4 mr-2" />
                          Editar Mapa
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                {/* Quick Actions */}
                <Card className="bg-gradient-card border-primary/30 shadow-card">
                  <CardHeader>
                    <CardTitle className="text-foreground">Ações Rápidas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {role === 'gm' ? (
                      <>
                        <Button variant="epic" size="sm" className="w-full justify-start">
                          <Plus className="w-4 h-4 mr-2" />
                          Adicionar NPC
                        </Button>
                        <Button variant="epic" size="sm" className="w-full justify-start">
                          <Sword className="w-4 h-4 mr-2" />
                          Iniciar Combate
                        </Button>
                        <Button variant="epic" size="sm" className="w-full justify-start">
                          <Eye className="w-4 h-4 mr-2" />
                          Controlar Visão
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="epic" size="sm" className="w-full justify-start">
                          <Eye className="w-4 h-4 mr-2" />
                          Investigar
                        </Button>
                        <Button variant="epic" size="sm" className="w-full justify-start">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Falar com NPC
                        </Button>
                        <Button variant="epic" size="sm" className="w-full justify-start">
                          <Users className="w-4 h-4 mr-2" />
                          Trocar Personagem
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Selected Character */}
                {selectedCharacter && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">Personagem Ativo</h3>
                    <CharacterCard character={selectedCharacter} />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Characters Tab */}
          <TabsContent value="characters" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {role === 'gm' ? 'Todos os Personagens' : 'Meus Personagens'}
              </h2>
              {role === 'player' && (
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Personagem
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isOwner={role === 'player'}
                  onSelect={handleCharacterSelect}
                />
              ))}
            </div>
          </TabsContent>

          {/* Spells Tab */}
          <TabsContent value="spells" className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Grimório de Magias</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockSpells.map((spell) => (
                <SpellCard
                  key={spell.id}
                  spell={spell}
                  onCast={handleSpellCast}
                  onFuse={(spell) => toast.success(`Tentando fusão com ${spell.name}!`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <Card className="bg-gradient-card border-primary/30 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Mapa Interativo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted/30 rounded-lg border border-border flex items-center justify-center">
                  <div className="text-center">
                    <Map className="w-24 h-24 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Mapa Avançado</h3>
                    <p className="text-muted-foreground">Sistema de mapa 2D/3D interativo será implementado aqui</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <Card className="bg-gradient-card border-primary/30 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Chat da Mesa</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-96 w-full rounded-md border border-border p-4">
                  <div className="space-y-3">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start gap-3">
                        <Badge 
                          className={
                            msg.type === 'gm' ? 'bg-primary' :
                            msg.type === 'system' ? 'bg-accent' : 'bg-secondary'
                          }
                        >
                          {msg.user}
                        </Badge>
                        <div className="flex-1">
                          <p className="text-foreground">{msg.message}</p>
                          <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="bg-muted border-primary/30 focus:border-primary"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <Button variant="hero" onClick={handleSendMessage}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dice Tab */}
          <TabsContent value="dice" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <DiceRoller />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};