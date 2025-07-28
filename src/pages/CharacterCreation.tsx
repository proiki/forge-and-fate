import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Dice6, Save, Shuffle } from "lucide-react";
import { toast } from "sonner";

interface CharacterCreationProps {
  onBack: () => void;
  onCharacterCreated: (character: any) => void;
}

export const CharacterCreation = ({ onBack, onCharacterCreated }: CharacterCreationProps) => {
  const [character, setCharacter] = useState({
    name: "",
    class: "Guerreiro",
    level: 1,
    avatar: "",
    attributes: {
      strength: 10,
      defense: 10,
      agility: 10,
      intelligence: 10,
      luck: 10
    }
  });

  const [availablePoints, setAvailablePoints] = useState(25);

  const classes = [
    { name: "Guerreiro", description: "Especialista em combate corpo a corpo", color: "bg-magic-fire" },
    { name: "Mago", description: "Manipulador das artes arcanas", color: "bg-magic-water" },
    { name: "Assassino", description: "Mestre das sombras e furtividade", color: "bg-magic-shadow" },
    { name: "Paladino", description: "Campeão da luz e justiça", color: "bg-magic-light" },
    { name: "Druida", description: "Guardião da natureza", color: "bg-magic-earth" },
    { name: "Arqueiro", description: "Mestre dos ataques à distância", color: "bg-magic-air" }
  ];

  const updateAttribute = (attr: string, value: number[]) => {
    const newValue = value[0];
    const currentValue = character.attributes[attr as keyof typeof character.attributes];
    const difference = newValue - currentValue;
    
    if (difference > 0 && availablePoints < difference) {
      toast.error("Pontos insuficientes!");
      return;
    }

    setCharacter(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: newValue
      }
    }));
    setAvailablePoints(prev => prev - difference);
  };

  const randomizeAttributes = () => {
    const newAttributes = {
      strength: Math.floor(Math.random() * 16) + 5,
      defense: Math.floor(Math.random() * 16) + 5,
      agility: Math.floor(Math.random() * 16) + 5,
      intelligence: Math.floor(Math.random() * 16) + 5,
      luck: Math.floor(Math.random() * 16) + 5
    };
    
    const totalUsed = Object.values(newAttributes).reduce((sum, val) => sum + val, 0) - 50;
    
    setCharacter(prev => ({
      ...prev,
      attributes: newAttributes
    }));
    setAvailablePoints(25 - totalUsed);
    toast.success("Atributos aleatorizados!");
  };

  const handleSave = () => {
    if (!character.name.trim()) {
      toast.error("Digite um nome para o personagem!");
      return;
    }

    const newCharacter = {
      ...character,
      id: Math.random().toString(36).substring(2, 9),
      hp: 100 + (character.attributes.defense * 5),
      maxHp: 100 + (character.attributes.defense * 5),
      mana: 50 + (character.attributes.intelligence * 3),
      maxMana: 50 + (character.attributes.intelligence * 3)
    };

    onCharacterCreated(newCharacter);
    toast.success("Personagem criado com sucesso!");
  };

  return (
    <div className="min-h-screen bg-gradient-hero p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Criação de Personagem</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Character Info */}
          <Card className="bg-gradient-card border-primary/30 shadow-card">
            <CardHeader>
              <CardTitle className="text-foreground">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar and Name */}
              <div className="flex items-center gap-4">
                <Avatar className="w-20 h-20 border-2 border-primary/50">
                  <AvatarImage src={character.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                    {character.name.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <Label htmlFor="name" className="text-foreground">Nome do Personagem</Label>
                  <Input
                    id="name"
                    value={character.name}
                    onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite o nome..."
                    className="bg-muted border-primary/30 focus:border-primary"
                  />
                </div>
              </div>

              {/* Class Selection */}
              <div>
                <Label className="text-foreground mb-3 block">Classe</Label>
                <div className="grid grid-cols-2 gap-3">
                  {classes.map((cls) => (
                    <Card
                      key={cls.name}
                      className={`cursor-pointer transition-all duration-300 ${
                        character.class === cls.name
                          ? 'border-primary shadow-glow'
                          : 'border-border hover:border-primary/50'
                      }`}
                      onClick={() => setCharacter(prev => ({ ...prev, class: cls.name }))}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${cls.color} text-white text-xs`}>
                            {cls.name}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{cls.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attributes */}
          <Card className="bg-gradient-card border-primary/30 shadow-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-foreground">Atributos</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-primary border-primary">
                    Pontos: {availablePoints}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={randomizeAttributes}>
                    <Shuffle className="w-4 h-4 mr-1" />
                    <Dice6 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(character.attributes).map(([attr, value]) => (
                <div key={attr} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground capitalize">{attr === 'strength' ? 'Força' : attr === 'defense' ? 'Defesa' : attr === 'agility' ? 'Agilidade' : attr === 'intelligence' ? 'Inteligência' : 'Sorte'}</Label>
                    <Badge variant="outline" className="text-primary">
                      {value}
                    </Badge>
                  </div>
                  <Slider
                    value={[value]}
                    onValueChange={(val) => updateAttribute(attr, val)}
                    max={20}
                    min={5}
                    step={1}
                    className="w-full"
                  />
                </div>
              ))}

              {/* Character Stats Preview */}
              <div className="border-t border-border pt-4 space-y-2">
                <h4 className="font-semibold text-foreground">Status Calculados:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">HP:</span>
                    <span className="text-foreground font-bold">
                      {100 + (character.attributes.defense * 5)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mana:</span>
                    <span className="text-foreground font-bold">
                      {50 + (character.attributes.intelligence * 3)}
                    </span>
                  </div>
                </div>
              </div>

              <Button 
                variant="hero" 
                size="lg" 
                className="w-full"
                onClick={handleSave}
              >
                <Save className="w-5 h-5 mr-2" />
                Criar Personagem
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;