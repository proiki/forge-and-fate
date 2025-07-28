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
    <div className="space-y-6">
      {/* Map Selection */}
      <Card className="bg-gradient-card border-primary/30 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Mapas Disponíveis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {mapTemplates.map((map) => (
              <div
                key={map.id}
                className={`cursor-pointer rounded-lg border-2 transition-all ${
                  selectedMap.id === map.id 
                    ? 'border-primary shadow-lg' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleMapChange(map.id)}
              >
                <img 
                  src={map.image} 
                  alt={map.name}
                  className="w-full h-24 object-cover rounded-t-lg"
                />
                <div className="p-3">
                  <h3 className="font-semibold text-sm text-foreground">{map.name}</h3>
                  <p className="text-xs text-muted-foreground">{map.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Canvas */}
        <div className="lg:col-span-3">
          <Card className="bg-gradient-card border-primary/30 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  {selectedMap.name}
                  <Badge className="bg-primary text-primary-foreground">
                    {role === 'gm' ? 'Modo Mestre' : 'Modo Jogador'}
                  </Badge>
                </CardTitle>
                {role === 'gm' && (
                  <div className="flex gap-2">
                    <Button
                      variant={selectedTool === 'select' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToolChange('select')}
                    >
                      <Move className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={selectedTool === 'add' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleToolChange('add')}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={clearMap}>
                      Limpar
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden shadow-inner">
                <canvas ref={canvasRef} className="max-w-full" />
              </div>
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Jogadores Online:</span>
                </div>
                {playerPositions.map((player) => (
                  <Badge key={player.id} style={{ backgroundColor: player.color }}>
                    {player.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets Panel */}
        {role === 'gm' && (
          <div>
            <Card className="bg-gradient-card border-primary/30 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground">Elementos do Jogo</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weapons" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weapons">Armas</TabsTrigger>
                    <TabsTrigger value="armor">Armaduras</TabsTrigger>
                    <TabsTrigger value="tools">Ferramentas</TabsTrigger>
                  </TabsList>
                  <TabsList className="grid w-full grid-cols-3 mt-2">
                    <TabsTrigger value="monsters">Monstros</TabsTrigger>
                    <TabsTrigger value="npcs">NPCs</TabsTrigger>
                    <TabsTrigger value="objects">Objetos</TabsTrigger>
                  </TabsList>

                  <TabsContent value="weapons" className="space-y-2">
                    {gameAssets.weapons.map((weapon) => (
                      <div
                        key={weapon.id}
                        className="p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleAddObject(weapon)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                            ⚔️
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{weapon.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Dano: {weapon.damage} {weapon.range && `• Alcance: ${weapon.range}`}
                              {weapon.special && `• ${weapon.special}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="armor" className="space-y-2">
                    {gameAssets.armor.map((armor) => (
                      <div
                        key={armor.id}
                        className="p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleAddObject(armor)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-blue-500/20 rounded flex items-center justify-center">
                            🛡️
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{armor.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Defesa: {armor.defense} • {armor.weight}
                              {armor.magic && ` • Magia: ${armor.magic}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="tools" className="space-y-2">
                    {gameAssets.tools.map((tool) => (
                      <div
                        key={tool.id}
                        className="p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleAddObject(tool)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-yellow-500/20 rounded flex items-center justify-center">
                            🔧
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{tool.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {tool.use} {tool.durability && `• Durabilidade: ${tool.durability}`}
                              {tool.weight && `• ${tool.weight}`} {tool.fuel && `• ${tool.fuel}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="monsters" className="space-y-2">
                    {gameAssets.monsters.map((monster) => (
                      <div
                        key={monster.id}
                        className="p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleAddObject(monster)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-red-500/20 rounded flex items-center justify-center">
                            👹
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{monster.name}</div>
                            <div className="text-xs text-muted-foreground">
                              HP: {monster.hp} • Level: {monster.level} • Ataque: {monster.attack}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="npcs" className="space-y-2">
                    {gameAssets.npcs.map((npc) => (
                      <div
                        key={npc.id}
                        className="p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleAddObject(npc)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-accent/20 rounded flex items-center justify-center">
                            👤
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{npc.name}</div>
                            <div className="text-xs text-muted-foreground">
                              HP: {npc.hp} • Level: {npc.level}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </TabsContent>

                  <TabsContent value="objects" className="space-y-2">
                    {gameAssets.objects.map((object) => (
                      <div
                        key={object.id}
                        className="p-2 border border-border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleAddObject(object)}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-secondary/20 rounded flex items-center justify-center">
                            📦
                          </div>
                          <div>
                            <div className="text-sm font-medium text-foreground">{object.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {object.interactive && "Interativo"} {object.light && "• Fonte de luz"}
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