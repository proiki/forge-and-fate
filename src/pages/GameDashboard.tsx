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
import { MonsterCard } from "@/components/MonsterCard";
import { Map2D } from "@/components/Map2D";
import { Map3D } from "@/components/Map3D";
import { Inventory } from "@/components/Inventory";
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
  const [activeMapMode, setActiveMapMode] = useState<'2d' | '3d'>('2d');

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

  const mockMonsters = [
    {
      id: "1",
      name: "Goblin Ladrão",
      type: "Humanoide",
      level: 2,
      hp: 25,
      maxHp: 25,
      attack: 8,
      defense: 4,
      speed: 12,
      abilities: ["Furtividade", "Ataque Surpresa"],
      weaknesses: ["Luz", "Barulho"],
      resistances: ["Escuridão"],
      description: "Um pequeno humanoide verde conhecido por sua astúcia e ganância.",
      rarity: "common" as const,
      icon: "👺"
    },
    {
      id: "2",
      name: "Orc Guerreiro",
      type: "Humanoide",
      level: 5,
      hp: 65,
      maxHp: 65,
      attack: 15,
      defense: 8,
      speed: 8,
      abilities: ["Fúria", "Intimidação"],
      weaknesses: ["Magia", "Estratégia"],
      resistances: ["Físico"],
      description: "Um guerreiro brutal com força descomunal e sede de batalha.",
      rarity: "rare" as const,
      icon: "👹"
    },
    {
      id: "3",
      name: "Dragão Jovem",
      type: "Dragão",
      level: 12,
      hp: 200,
      maxHp: 200,
      attack: 25,
      defense: 18,
      speed: 15,
      abilities: ["Sopro de Fogo", "Voo", "Magia Arcana"],
      weaknesses: ["Gelo", "Armas Dracônicas"],
      resistances: ["Fogo", "Medo"],
      description: "Um dragão em crescimento com poder devastador e inteligência superior.",
      rarity: "legendary" as const,
      icon: "🐉"
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
          <TabsList className="grid w-full grid-cols-8 bg-card/50 backdrop-blur-sm">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="characters">Personagens</TabsTrigger>
            <TabsTrigger value="spells">Magias</TabsTrigger>
            <TabsTrigger value="monsters">Monstros</TabsTrigger>
            <TabsTrigger value="map">Mapa</TabsTrigger>
            <TabsTrigger value="chat">Chat</TabsTrigger>
            <TabsTrigger value="dice">Dados</TabsTrigger>
            <TabsTrigger value="inventory">Inventário</TabsTrigger>
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

          {/* Monsters Tab */}
          <TabsContent value="monsters" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">
                {role === 'gm' ? 'Bestiário - Controle de Monstros' : 'Monstros Encontrados'}
              </h2>
              {role === 'gm' && (
                <Button variant="hero">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Monstro
                </Button>
              )}
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMonsters.map((monster) => (
                <MonsterCard
                  key={monster.id}
                  monster={monster}
                  isGM={role === 'gm'}
                  onAttack={(monster) => toast.success(`${monster.name} atacou!`)}
                  onDefeat={(monster) => toast.success(`${monster.name} foi derrotado!`)}
                  onEdit={(monster) => toast.success(`Editando ${monster.name}`)}
                />
              ))}
            </div>
          </TabsContent>

          {/* Map Tab */}
          <TabsContent value="map" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Sistema de Mapas</h2>
                <div className="flex gap-2">
                  <Button 
                    variant={activeMapMode === '2d' ? 'default' : 'outline'}
                    onClick={() => setActiveMapMode('2d')}
                  >
                    Mapa 2D
                  </Button>
                  <Button 
                    variant={activeMapMode === '3d' ? 'default' : 'outline'}
                    onClick={() => setActiveMapMode('3d')}
                  >
                    Mapa 3D
                  </Button>
                </div>
              </div>
              
              {activeMapMode === '2d' ? (
                <Map2D role={role} />
              ) : (
                <Map3D role={role} />
              )}
            </div>
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

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="space-y-6">
            <Inventory role={role} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default GameDashboard;