import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Rect, Circle } from "fabric";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, Move, Eye, Users, Settings } from "lucide-react";
import tavernMap from "@/assets/tavern-map.jpg";
import forestMap from "@/assets/forest-map.jpg";
import dungeonMap from "@/assets/dungeon-map.jpg";
import weaponsIcons from "@/assets/weapons-icons.png";
import npcsCollection from "@/assets/npcs-collection.png";
import objectsCollection from "@/assets/objects-collection.png";

interface Map2DProps {
  role: 'gm' | 'player';
}

const mapTemplates = [
  { id: 'tavern', name: 'Taverna do Dragão', image: tavernMap, description: 'Taverna aconchegante para início de aventuras' },
  { id: 'forest', name: 'Floresta Sombria', image: forestMap, description: 'Floresta misteriosa cheia de perigos' },
  { id: 'dungeon', name: 'Masmorras Antigas', image: dungeonMap, description: 'Calabouços escuros com tesouros escondidos' }
];

const gameAssets = {
  weapons: [
    { id: 'sword', name: 'Espada Longa', type: 'weapon', damage: '1d8', icon: weaponsIcons },
    { id: 'bow', name: 'Arco Élfico', type: 'weapon', damage: '1d6', range: '150m', icon: weaponsIcons },
    { id: 'staff', name: 'Cajado Arcano', type: 'weapon', damage: '1d4', magic: '+2', icon: weaponsIcons },
    { id: 'axe', name: 'Machado de Guerra', type: 'weapon', damage: '1d10', icon: weaponsIcons }
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
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [selectedMap, setSelectedMap] = useState(mapTemplates[0]);
  const [selectedTool, setSelectedTool] = useState<'select' | 'move' | 'add'>('select');
  const [placedObjects, setPlacedObjects] = useState<any[]>([]);
  const [playerPositions, setPlayerPositions] = useState([
    { id: 'player1', name: 'Aragorn', x: 100, y: 100, color: '#3b82f6' },
    { id: 'player2', name: 'Gandalf', x: 200, y: 150, color: '#8b5cf6' }
  ]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#2a2a2a",
    });

    // Load background map
    canvas.backgroundColor = "#2a2a2a";

    setFabricCanvas(canvas);

    // Add player positions
    playerPositions.forEach(player => {
      const playerToken = new Circle({
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

    const object = new Rect({
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