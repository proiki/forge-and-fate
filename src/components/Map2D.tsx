import { useEffect, useRef, useState } from "react";
import * as fabric from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Move, Eye, Users, Settings } from "lucide-react";
import tavernMap from "@/assets/tavern-map.jpg";
import forestMap from "@/assets/forest-map.jpg";
import dungeonMap from "@/assets/dungeon-map.jpg";
import volcanicForgeMap from "@/assets/volcanic-forge-map.jpg";
import medievalTownMap from "@/assets/medieval-town-map.jpg";
import mountainCaveMap from "@/assets/mountain-cave-map.jpg";
import castleMap from "@/assets/castle-map.jpg";
import weaponsIcons from "@/assets/weapons-icons.png";
import weaponsCollection from "@/assets/weapons-collection.jpg";
import npcsCollection from "@/assets/npcs-collection.png";
import objectsCollection from "@/assets/objects-collection.png";
import toolsEquipment from "@/assets/tools-equipment.png";
import armorCollection from "@/assets/armor-collection.jpg";
import monstersCollection from "@/assets/monsters-collection.jpg";

interface Map2DProps {
  role: 'gm' | 'player';
}

const mapTemplates = [
  { id: 'tavern', name: 'Taverna do Dragão', image: tavernMap, description: 'Taverna aconchegante para início de aventuras' },
  { id: 'forest', name: 'Floresta Sombria', image: forestMap, description: 'Floresta misteriosa cheia de perigos' },
  { id: 'dungeon', name: 'Masmorras Antigas', image: dungeonMap, description: 'Calabouços escuros com tesouros escondidos' },
  { id: 'volcanic', name: 'Forja Vulcânica', image: volcanicForgeMap, description: 'Forja ardente nas profundezas do vulcão' },
  { id: 'town', name: 'Cidade Medieval', image: medievalTownMap, description: 'Cidade movimentada com mercadores e aventureiros' },
  { id: 'cave', name: 'Cavernas da Montanha', image: mountainCaveMap, description: 'Cavernas perigosas nas altas montanhas' },
  { id: 'castle', name: 'Castelo Sombrio', image: castleMap, description: 'Castelo antigo cheio de mistérios e perigos' }
];

const gameAssets = {
  weapons: [
    { id: 'sword', name: 'Espada Longa', type: 'weapon', damage: '1d8', icon: weaponsIcons },
    { id: 'bow', name: 'Arco Élfico', type: 'weapon', damage: '1d6', range: '150m', icon: weaponsIcons },
    { id: 'staff', name: 'Cajado Arcano', type: 'weapon', damage: '1d4', magic: '+2', icon: weaponsIcons },
    { id: 'axe', name: 'Machado de Guerra', type: 'weapon', damage: '1d10', icon: weaponsIcons },
    { id: 'dagger', name: 'Adaga Envenenada', type: 'weapon', damage: '1d4', special: 'Veneno', icon: weaponsCollection },
    { id: 'hammer', name: 'Martelo de Thor', type: 'weapon', damage: '2d6', special: 'Raio', icon: weaponsCollection }
  ],
  armor: [
    { id: 'leather', name: 'Armadura de Couro', type: 'armor', defense: '+2', weight: 'Leve', icon: armorCollection },
    { id: 'chainmail', name: 'Cota de Malha', type: 'armor', defense: '+4', weight: 'Média', icon: armorCollection },
    { id: 'plate', name: 'Armadura de Placas', type: 'armor', defense: '+6', weight: 'Pesada', icon: armorCollection },
    { id: 'robe', name: 'Vestes Mágicas', type: 'armor', defense: '+1', magic: '+3', icon: armorCollection }
  ],
  tools: [
    { id: 'pickaxe', name: 'Picareta', type: 'tool', use: 'Mineração', durability: 100, icon: toolsEquipment },
    { id: 'rope', name: 'Corda (15m)', type: 'tool', use: 'Escalada', weight: '2kg', icon: toolsEquipment },
    { id: 'lantern', name: 'Lanterna', type: 'tool', use: 'Iluminação', fuel: '6h', icon: toolsEquipment },
    { id: 'lockpick', name: 'Gazuas', type: 'tool', use: 'Abrir fechaduras', skill: 'Furtividade', icon: toolsEquipment }
  ],
  monsters: [
    { id: 'goblin', name: 'Goblin', type: 'monster', hp: 15, level: 1, attack: 5, icon: monstersCollection },
    { id: 'orc', name: 'Orc Guerreiro', type: 'monster', hp: 35, level: 3, attack: 8, icon: monstersCollection },
    { id: 'troll', name: 'Troll das Cavernas', type: 'monster', hp: 80, level: 6, attack: 12, icon: monstersCollection },
    { id: 'dragon', name: 'Dragão Jovem', type: 'monster', hp: 150, level: 10, attack: 20, icon: monstersCollection }
  ],
  npcs: [
    { id: 'wizard', name: 'Mago Sábio', type: 'npc', hp: 50, level: 8, icon: npcsCollection },
    { id: 'merchant', name: 'Mercador', type: 'npc', hp: 30, level: 3, icon: npcsCollection },
    { id: 'guard', name: 'Guarda da Cidade', type: 'npc', hp: 80, level: 5, icon: npcsCollection },
    { id: 'priest', name: 'Sacerdote', type: 'npc', hp: 45, level: 6, icon: npcsCollection }
  ],
  objects: [
    { id: 'chest', name: 'Baú do Tesouro', type: 'object', interactive: true, icon: objectsCollection },
    { id: 'table', name: 'Mesa de Madeira', type: 'object', interactive: false, icon: objectsCollection },
    { id: 'torch', name: 'Tocha Acesa', type: 'object', light: true, icon: objectsCollection },
    { id: 'book', name: 'Livro Antigo', type: 'object', interactive: true, icon: objectsCollection }
  ]
};

export const Map2D = ({ role }: Map2DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<fabric.Canvas | null>(null);
  const [selectedMap, setSelectedMap] = useState(mapTemplates[0]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'add'>('select');
  const [placedObjects, setPlacedObjects] = useState<any[]>([]);
  const [playerPositions, setPlayerPositions] = useState([
    { id: 'player1', name: 'Aragorn', x: 100, y: 100, color: '#3b82f6' },
    { id: 'player2', name: 'Gandalf', x: 200, y: 150, color: '#8b5cf6' }
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#2a2a2a",
    });

    // Load background map
    canvas.backgroundColor = "#2a2a2a";

    setFabricCanvas(canvas);

    // Add player positions
    playerPositions.forEach(player => {
      const playerToken = new fabric.Circle({
        left: player.x,
        top: player.y,
        radius: 15,
        fill: player.color,
        stroke: '#ffffff',
        strokeWidth: 2,
        selectable: role === 'gm',
        hasControls: role === 'gm',
        hasBorders: role === 'gm'
      });
      canvas.add(playerToken);
    });

    toast.success(`Mapa ${selectedMap.name} carregado!`);

    return () => {
      canvas.dispose();
    };
  }, [selectedMap, role]);

  const handleMapChange = (mapId: string) => {
    const newMap = mapTemplates.find(m => m.id === mapId);
    if (newMap) {
      setSelectedMap(newMap);
      toast.success(`Mudando para ${newMap.name}`);
    }
  };

  const handleAddObject = (asset: any) => {
    if (!fabricCanvas) return;

    const object = new fabric.Rect({
      left: Math.random() * 600 + 100,
      top: Math.random() * 400 + 100,
      width: 40,
      height: 40,
      fill: asset.type === 'weapon' ? '#f59e0b' : 
            asset.type === 'npc' ? '#10b981' : '#6366f1',
      stroke: '#ffffff',
      strokeWidth: 1,
      selectable: role === 'gm',
      hasControls: role === 'gm',
      hasBorders: role === 'gm'
    });

    fabricCanvas.add(object);
    setPlacedObjects(prev => [...prev, { ...asset, fabricObject: object }]);
    toast.success(`${asset.name} adicionado ao mapa!`);
  };

  const handleToolChange = (tool: typeof selectedTool) => {
    setSelectedTool(tool);
    if (fabricCanvas) {
      fabricCanvas.selection = tool !== 'add';
      fabricCanvas.forEachObject(obj => {
        obj.selectable = role === 'gm' && tool !== 'add';
      });
    }
  };

  const clearMap = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#2a2a2a";
    fabricCanvas.renderAll();
    setPlacedObjects([]);
    toast.success("Mapa limpo!");
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-6 space-y-8">
      {/* Map Selection */}
      <Card className="bg-card/95 backdrop-blur-sm border-primary/20 shadow-epic">
        <CardHeader className="pb-4">
          <CardTitle className="text-foreground flex items-center gap-3 text-xl">
            <div className="p-2 rounded-lg bg-primary/20">
              <Eye className="w-6 h-6 text-primary" />
            </div>
            Mapas Épicos Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {mapTemplates.map((map) => (
              <div
                key={map.id}
                className={`group cursor-pointer rounded-xl border-2 transition-epic overflow-hidden ${
                  selectedMap.id === map.id 
                    ? 'border-primary shadow-glow bg-primary/5' 
                    : 'border-border hover:border-primary/60 hover:shadow-lg hover:scale-105'
                }`}
                onClick={() => handleMapChange(map.id)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={map.image} 
                    alt={map.name}
                    className="w-full h-32 object-cover transition-epic group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  {selectedMap.id === map.id && (
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-primary text-primary-foreground shadow-lg">
                        Ativo
                      </Badge>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-foreground text-sm leading-tight">{map.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{map.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Canvas */}
        <div className="lg:col-span-3">
          <Card className="bg-card/95 backdrop-blur-sm border-primary/20 shadow-epic overflow-hidden">
            <CardHeader className="bg-gradient-primary/10 border-b border-primary/20">
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-3 text-xl">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  {selectedMap.name}
                  <Badge className="bg-gradient-primary text-primary-foreground shadow-glow border-0">
                    {role === 'gm' ? '⚡ Modo Mestre' : '🎭 Modo Jogador'}
                  </Badge>
                </CardTitle>
                {role === 'gm' && (
                  <div className="flex gap-3">
                    <Button
                      variant={selectedTool === 'select' ? 'default' : 'outline'}
                      size="sm"
                      className={selectedTool === 'select' ? 'shadow-glow' : 'hover:shadow-lg'}
                      onClick={() => handleToolChange('select')}
                    >
                      <Move className="w-4 h-4 mr-1" />
                      Selecionar
                    </Button>
                    <Button
                      variant={selectedTool === 'add' ? 'default' : 'outline'}
                      size="sm"
                      className={selectedTool === 'add' ? 'shadow-glow' : 'hover:shadow-lg'}
                      onClick={() => handleToolChange('add')}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Adicionar
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={clearMap}
                      className="hover:scale-105 transition-epic"
                    >
                      🗑️ Limpar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="border-2 border-primary/30 rounded-xl overflow-hidden shadow-card bg-gradient-to-br from-background/50 to-muted/20">
                <canvas ref={canvasRef} className="max-w-full block" />
              </div>
              <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center gap-4 flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded bg-primary/20">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Aventureiros Online:</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {playerPositions.map((player) => (
                      <Badge 
                        key={player.id} 
                        className="shadow-lg border-0"
                        style={{ 
                          backgroundColor: player.color,
                          color: '#ffffff'
                        }}
                      >
                        🎭 {player.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets Panel */}
        {role === 'gm' && (
          <div className="space-y-6">
            <Card className="bg-card/95 backdrop-blur-sm border-primary/20 shadow-epic">
              <CardHeader className="bg-gradient-primary/10 border-b border-primary/20">
                <CardTitle className="text-foreground flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    ⚔️
                  </div>
                  Arsenal Épico
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Tabs defaultValue="weapons" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2 gap-1 bg-muted/50 p-1">
                    <TabsTrigger value="weapons" className="text-xs">⚔️ Armas</TabsTrigger>
                    <TabsTrigger value="armor" className="text-xs">🛡️ Armadura</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-2 gap-1 bg-muted/50 p-1 mt-2">
                    <TabsTrigger value="tools" className="text-xs">🔧 Ferramentas</TabsTrigger>
                    <TabsTrigger value="monsters" className="text-xs">👹 Monstros</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-2 gap-1 bg-muted/50 p-1 mt-2">
                    <TabsTrigger value="npcs" className="text-xs">🧙 NPCs</TabsTrigger>
                    <TabsTrigger value="objects" className="text-xs">📦 Objetos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="weapons" className="space-y-3 max-h-80 overflow-y-auto">
                    {gameAssets.weapons.map((weapon) => (
                      <div
                        key={weapon.id}
                        className="group p-3 border border-border rounded-lg cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-epic hover:shadow-lg"
                        onClick={() => handleAddObject(weapon)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow group-hover:scale-110 transition-epic">
                            ⚔️
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">{weapon.name}</div>
                            <div className="text-xs text-muted-foreground">
                              💥 {weapon.damage} {weapon.range && `• 🎯 ${weapon.range}`}
                              {weapon.special && `• ✨ ${weapon.special}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="armor" className="space-y-3 max-h-80 overflow-y-auto">
                    {gameAssets.armor.map((armor) => (
                      <div
                        key={armor.id}
                        className="group p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/10 hover:border-secondary/50 transition-epic hover:shadow-lg"
                        onClick={() => handleAddObject(armor)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-epic">
                            🛡️
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">{armor.name}</div>
                            <div className="text-xs text-muted-foreground">
                              🛡️ {armor.defense} • ⚖️ {armor.weight}
                              {armor.magic && ` • ✨ ${armor.magic}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="tools" className="space-y-3 max-h-80 overflow-y-auto">
                    {gameAssets.tools.map((tool) => (
                      <div
                        key={tool.id}
                        className="group p-3 border border-border rounded-lg cursor-pointer hover:bg-accent/10 hover:border-accent/50 transition-epic hover:shadow-lg"
                        onClick={() => handleAddObject(tool)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-accent/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-epic">
                            🔧
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">
                              🎯 {tool.use} {tool.durability && `• 🔄 ${tool.durability}`}
                              {tool.weight && `• ⚖️ ${tool.weight}`} {tool.fuel && `• ⛽ ${tool.fuel}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="monsters" className="space-y-3 max-h-80 overflow-y-auto">
                    {gameAssets.monsters.map((monster) => (
                      <div
                        key={monster.id}
                        className="group p-3 border border-border rounded-lg cursor-pointer hover:bg-destructive/10 hover:border-destructive/50 transition-epic hover:shadow-lg"
                        onClick={() => handleAddObject(monster)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-destructive/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-epic">
                            👹
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">{monster.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ❤️ {monster.hp} • 🎚️ {monster.level} • ⚔️ {monster.attack}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="npcs" className="space-y-3 max-h-80 overflow-y-auto">
                    {gameAssets.npcs.map((npc) => (
                      <div
                        key={npc.id}
                        className="group p-3 border border-border rounded-lg cursor-pointer hover:bg-magic-water/10 hover:border-magic-water/50 transition-epic hover:shadow-lg"
                        onClick={() => handleAddObject(npc)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-magic-water/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-epic">
                            🧙
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">{npc.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ❤️ {npc.hp} • 🎚️ {npc.level}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="objects" className="space-y-3 max-h-80 overflow-y-auto">
                    {gameAssets.objects.map((object) => (
                      <div
                        key={object.id}
                        className="group p-3 border border-border rounded-lg cursor-pointer hover:bg-magic-earth/10 hover:border-magic-earth/50 transition-epic hover:shadow-lg"
                        onClick={() => handleAddObject(object)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-magic-earth/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-epic">
                            📦
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-foreground truncate">{object.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {object.interactive ? '🎮 Interativo' : '🎨 Decorativo'}
                              {object.light && ' • 💡 Ilumina'}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};