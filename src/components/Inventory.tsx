import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Package, 
  Sword, 
  Shield, 
  Coins, 
  Gift,
  Search,
  Star,
  Plus,
  Minus
} from "lucide-react";

interface InventoryItem {
  id: string;
  name: string;
  type: 'weapon' | 'armor' | 'consumable' | 'misc' | 'currency';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  value: number;
  description: string;
  stats?: Record<string, number>;
  icon: string;
}

interface InventoryProps {
  role?: 'gm' | 'player';
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Espada de Ferro',
    type: 'weapon',
    rarity: 'common',
    quantity: 1,
    value: 50,
    description: 'Uma espada robusta de ferro bem forjado.',
    stats: { damage: 8, accuracy: 5 },
    icon: '⚔️'
  },
  {
    id: '2',
    name: 'Escudo de Carvalho',
    type: 'armor',
    rarity: 'rare',
    quantity: 1,
    value: 75,
    description: 'Escudo feito da madeira mais resistente.',
    stats: { defense: 12, durability: 100 },
    icon: '🛡️'
  },
  {
    id: '3',
    name: 'Poção de Cura',
    type: 'consumable',
    rarity: 'common',
    quantity: 5,
    value: 25,
    description: 'Restaura 50 pontos de vida.',
    stats: { heal: 50 },
    icon: '🧪'
  },
  {
    id: '4',
    name: 'Anel do Sábio',
    type: 'misc',
    rarity: 'epic',
    quantity: 1,
    value: 500,
    description: 'Aumenta a inteligência permanentemente.',
    stats: { intelligence: 3, mana: 20 },
    icon: '💍'
  },
  {
    id: '5',
    name: 'Moedas de Ouro',
    type: 'currency',
    rarity: 'common',
    quantity: 1250,
    value: 1,
    description: 'Moeda oficial do reino.',
    icon: '🪙'
  }
];

const rarityColors = {
  common: 'bg-slate-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

const typeIcons = {
  weapon: Sword,
  armor: Shield,
  consumable: Package,
  misc: Star,
  currency: Coins
};

export const Inventory = ({ role = 'player' }: InventoryProps) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalValue = inventory.reduce((sum, item) => sum + (item.value * item.quantity), 0);
  const totalWeight = inventory.length; // Simplified weight calculation

  const handleUseItem = (item: InventoryItem) => {
    if (item.type === 'consumable' && item.quantity > 0) {
      setInventory(prev => 
        prev.map(i => 
          i.id === item.id 
            ? { ...i, quantity: i.quantity - 1 }
            : i
        ).filter(i => i.quantity > 0)
      );
      toast.success(`${item.name} usado! ${item.stats?.heal ? `+${item.stats.heal} HP` : ''}`);
    } else {
      toast.success(`${item.name} equipado!`);
    }
  };

  const handleGiveItem = (item: InventoryItem) => {
    if (role === 'gm') {
      toast.success(`${item.name} dado para o jogador!`);
    } else {
      toast.success(`${item.name} oferecido para troca!`);
    }
  };

  const handleSellItem = (item: InventoryItem) => {
    const sellValue = Math.floor(item.value * 0.7); // 70% of original value
    setInventory(prev => prev.filter(i => i.id !== item.id));
    
    // Add gold to inventory
    const goldIndex = inventory.findIndex(i => i.type === 'currency');
    if (goldIndex >= 0) {
      setInventory(prev => 
        prev.map((i, index) => 
          index === goldIndex 
            ? { ...i, quantity: i.quantity + sellValue }
            : i
        )
      );
    }
    
    toast.success(`${item.name} vendido por ${sellValue} moedas de ouro!`);
  };

  return (
    <div className="space-y-6">
      {/* Inventory Header */}
      <Card className="bg-gradient-card border-primary/30 shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-foreground flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Inventário
            </CardTitle>
            <div className="flex gap-4 text-sm">
              <Badge variant="outline">
                Valor Total: {totalValue} 🪙
              </Badge>
              <Badge variant="outline">
                Itens: {inventory.length}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar itens..."
                className="pl-10 bg-muted border-primary/30 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Tabs value={selectedType} onValueChange={setSelectedType}>
              <TabsList className="bg-muted/50">
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="weapon">Armas</TabsTrigger>
                <TabsTrigger value="armor">Armaduras</TabsTrigger>
                <TabsTrigger value="consumable">Consumíveis</TabsTrigger>
                <TabsTrigger value="misc">Diversos</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Items Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const IconComponent = typeIcons[item.type];
              
              return (
                <Card 
                  key={item.id}
                  className={`cursor-pointer transition-all hover:shadow-lg border-2 ${
                    selectedItem?.id === item.id 
                      ? 'border-primary shadow-lg' 
                      : 'border-border hover:border-primary/50'
                  } bg-gradient-card`}
                  onClick={() => setSelectedItem(item)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      <Badge className={`${rarityColors[item.rarity]} text-white text-xs`}>
                        {item.rarity}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-sm text-foreground mb-1">
                      {item.name}
                    </h3>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <IconComponent className="w-3 h-3" />
                        {item.type}
                      </span>
                      <span>x{item.quantity}</span>
                    </div>
                    
                    <div className="mt-2 text-xs">
                      <span className="text-primary font-medium">
                        {item.value} 🪙
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Item Details Panel */}
        <div>
          {selectedItem ? (
            <Card className="bg-gradient-card border-primary/30 shadow-card">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center gap-2">
                  <span className="text-2xl">{selectedItem.icon}</span>
                  {selectedItem.name}
                  <Badge className={`${rarityColors[selectedItem.rarity]} text-white ml-2`}>
                    {selectedItem.rarity}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {selectedItem.description}
                </p>

                {selectedItem.stats && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Estatísticas</h4>
                    <div className="space-y-1">
                      {Object.entries(selectedItem.stats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between text-sm">
                          <span className="text-muted-foreground capitalize">{stat}:</span>
                          <span className="text-primary font-medium">+{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valor unitário:</span>
                    <span className="text-foreground">{selectedItem.value} 🪙</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Quantidade:</span>
                    <span className="text-foreground">{selectedItem.quantity}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-muted-foreground">Valor total:</span>
                    <span className="text-primary">{selectedItem.value * selectedItem.quantity} 🪙</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {selectedItem.type === 'consumable' && (
                    <Button 
                      variant="hero" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleUseItem(selectedItem)}
                      disabled={selectedItem.quantity === 0}
                    >
                      Usar Item
                    </Button>
                  )}
                  
                  {(selectedItem.type === 'weapon' || selectedItem.type === 'armor') && (
                    <Button 
                      variant="epic" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleUseItem(selectedItem)}
                    >
                      Equipar
                    </Button>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleGiveItem(selectedItem)}
                    >
                      <Gift className="w-4 h-4 mr-1" />
                      {role === 'gm' ? 'Dar' : 'Trocar'}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSellItem(selectedItem)}
                    >
                      <Coins className="w-4 h-4 mr-1" />
                      Vender
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-gradient-card border-border shadow-card">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Selecione um Item
                </h3>
                <p className="text-muted-foreground">
                  Clique em um item para ver detalhes e ações disponíveis.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};