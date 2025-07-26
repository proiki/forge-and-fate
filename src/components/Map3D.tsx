import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Sphere, Plane } from '@react-three/drei';
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Plus, RotateCcw, Eye, Users, Settings } from "lucide-react";
import * as THREE from 'three';

interface Map3DProps {
  role: 'gm' | 'player';
}

interface GameObject {
  id: string;
  type: 'character' | 'npc' | 'object' | 'terrain';
  position: [number, number, number];
  name: string;
  color?: string;
}

const scenes3D = [
  { id: 'tavern3d', name: 'Taverna 3D', description: 'Ambiente 3D da taverna com móveis e decoração' },
  { id: 'forest3d', name: 'Floresta 3D', description: 'Ambiente florestal com árvores e vegetação' },
  { id: 'dungeon3d', name: 'Masmorra 3D', description: 'Calabouço com paredes de pedra e tochas' }
];

const Character3D = ({ position, color = '#3b82f6', name }: { position: [number, number, number], color?: string, name: string }) => {
  return (
    <group position={position}>
      <Sphere args={[0.3]} position={[0, 1, 0]}>
        <meshStandardMaterial color={color} />
      </Sphere>
      <Box args={[0.4, 1.2, 0.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color={color} />
      </Box>
      <Text
        position={[0, 2, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </group>
  );
};

const TavernScene = () => {
  return (
    <>
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#8B4513" />
      </Plane>
      
      {/* Tables */}
      <Box args={[2, 0.1, 1]} position={[2, 0.8, 2]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      <Box args={[2, 0.1, 1]} position={[-2, 0.8, 2]}>
        <meshStandardMaterial color="#654321" />
      </Box>
      
      {/* Bar counter */}
      <Box args={[6, 1, 1]} position={[0, 0.5, -4]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      
      {/* Walls */}
      <Box args={[20, 4, 0.2]} position={[0, 2, -10]}>
        <meshStandardMaterial color="#696969" />
      </Box>
      <Box args={[0.2, 4, 20]} position={[-10, 2, 0]}>
        <meshStandardMaterial color="#696969" />
      </Box>
      <Box args={[0.2, 4, 20]} position={[10, 2, 0]}>
        <meshStandardMaterial color="#696969" />
      </Box>
    </>
  );
};

const ForestScene = () => {
  const trees = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 15,
    z: (Math.random() - 0.5) * 15,
    height: Math.random() * 2 + 3
  }));

  return (
    <>
      {/* Ground */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#228B22" />
      </Plane>
      
      {/* Trees */}
      {trees.map((tree) => (
        <group key={tree.id} position={[tree.x, 0, tree.z]}>
          {/* Trunk */}
          <Box args={[0.3, tree.height, 0.3]} position={[0, tree.height / 2, 0]}>
            <meshStandardMaterial color="#8B4513" />
          </Box>
          {/* Crown */}
          <Sphere args={[1]} position={[0, tree.height + 0.5, 0]}>
            <meshStandardMaterial color="#006400" />
          </Sphere>
        </group>
      ))}
    </>
  );
};

const DungeonScene = () => {
  return (
    <>
      {/* Floor */}
      <Plane args={[20, 20]} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#2F2F2F" />
      </Plane>
      
      {/* Walls creating corridors */}
      <Box args={[20, 4, 0.5]} position={[0, 2, -10]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Box args={[20, 4, 0.5]} position={[0, 2, 10]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Box args={[0.5, 4, 20]} position={[-10, 2, 0]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      <Box args={[0.5, 4, 20]} position={[10, 2, 0]}>
        <meshStandardMaterial color="#4A4A4A" />
      </Box>
      
      {/* Pillars */}
      <Box args={[0.8, 4, 0.8]} position={[4, 2, 4]}>
        <meshStandardMaterial color="#2F2F2F" />
      </Box>
      <Box args={[0.8, 4, 0.8]} position={[-4, 2, 4]}>
        <meshStandardMaterial color="#2F2F2F" />
      </Box>
      <Box args={[0.8, 4, 0.8]} position={[4, 2, -4]}>
        <meshStandardMaterial color="#2F2F2F" />
      </Box>
      <Box args={[0.8, 4, 0.8]} position={[-4, 2, -4]}>
        <meshStandardMaterial color="#2F2F2F" />
      </Box>
    </>
  );
};

export const Map3D = ({ role }: Map3DProps) => {
  const [selectedScene, setSelectedScene] = useState(scenes3D[0]);
  const [gameObjects, setGameObjects] = useState<GameObject[]>([
    { id: 'player1', type: 'character', position: [2, 0, 2], name: 'Aragorn', color: '#3b82f6' },
    { id: 'player2', type: 'character', position: [-2, 0, 2], name: 'Gandalf', color: '#8b5cf6' }
  ]);
  const [selectedTool, setSelectedTool] = useState<'view' | 'add' | 'move'>('view');

  const renderScene = () => {
    switch (selectedScene.id) {
      case 'tavern3d':
        return <TavernScene />;
      case 'forest3d':
        return <ForestScene />;
      case 'dungeon3d':
        return <DungeonScene />;
      default:
        return <TavernScene />;
    }
  };

  const handleSceneChange = (sceneId: string) => {
    const newScene = scenes3D.find(s => s.id === sceneId);
    if (newScene) {
      setSelectedScene(newScene);
      toast.success(`Mudando para ${newScene.name}`);
    }
  };

  const addCharacter = () => {
    if (role !== 'gm') return;
    
    const newCharacter: GameObject = {
      id: `npc_${Date.now()}`,
      type: 'npc',
      position: [Math.random() * 6 - 3, 0, Math.random() * 6 - 3],
      name: 'Novo NPC',
      color: '#f59e0b'
    };
    
    setGameObjects(prev => [...prev, newCharacter]);
    toast.success('NPC adicionado ao mapa 3D!');
  };

  const resetCamera = () => {
    toast.success('Câmera resetada');
  };

  return (
    <div className="space-y-6">
      {/* Scene Selection */}
      <Card className="bg-gradient-card border-primary/30 shadow-card">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Cenários 3D
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {scenes3D.map((scene) => (
              <div
                key={scene.id}
                className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                  selectedScene.id === scene.id 
                    ? 'border-primary shadow-lg bg-primary/10' 
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => handleSceneChange(scene.id)}
              >
                <h3 className="font-semibold text-sm text-foreground">{scene.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">{scene.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* 3D Canvas */}
        <div className="lg:col-span-3">
          <Card className="bg-gradient-card border-primary/30 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  {selectedScene.name}
                  <Badge className="bg-primary text-primary-foreground">
                    Modo 3D {role === 'gm' ? '(Mestre)' : '(Jogador)'}
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  {role === 'gm' && (
                    <Button variant="hero" size="sm" onClick={addCharacter}>
                      <Plus className="w-4 h-4 mr-1" />
                      Add NPC
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={resetCamera}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg overflow-hidden shadow-inner bg-background">
                <Canvas
                  style={{ height: '500px' }}
                  camera={{ position: [10, 10, 10], fov: 60 }}
                  shadows
                >
                  <ambientLight intensity={0.3} />
                  <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={1} 
                    castShadow 
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                  />
                  <pointLight position={[0, 10, 0]} intensity={0.5} />
                  
                  {renderScene()}
                  
                  {gameObjects.map((obj) => (
                    <Character3D
                      key={obj.id}
                      position={obj.position}
                      color={obj.color}
                      name={obj.name}
                    />
                  ))}
                  
                  <OrbitControls 
                    enablePan={true} 
                    enableZoom={true} 
                    enableRotate={true}
                    maxPolarAngle={Math.PI / 2}
                    minDistance={5}
                    maxDistance={50}
                  />
                </Canvas>
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-sm text-foreground">Personagens na Cena:</span>
                </div>
                {gameObjects.filter(obj => obj.type === 'character').map((character) => (
                  <Badge key={character.id} style={{ backgroundColor: character.color }}>
                    {character.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div>
          <Card className="bg-gradient-card border-primary/30 shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Controles 3D</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p><strong>Navegação:</strong></p>
                <p>• Click + Arrastar: Rotacionar</p>
                <p>• Scroll: Zoom</p>
                <p>• Botão direito + Arrastar: Mover</p>
              </div>
              
              {role === 'gm' && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground">Ferramentas do Mestre</h4>
                  <Button variant="epic" size="sm" className="w-full" onClick={addCharacter}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar NPC
                  </Button>
                  <Button variant="epic" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Cenário
                  </Button>
                  <Button variant="epic" size="sm" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Controlar Visão
                  </Button>
                </div>
              )}

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Objetos na Cena</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {gameObjects.map((obj) => (
                    <div key={obj.id} className="flex items-center justify-between text-xs p-2 border border-border rounded">
                      <span className="text-foreground">{obj.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {obj.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};