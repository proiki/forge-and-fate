import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Sword, Shield, Heart, Zap, Eye, Users } from "lucide-react";

interface Character {
  id: string;
  name: string;
  class: string;
  level: number;
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  avatar?: string;
  attributes: {
    strength: number;
    defense: number;
    agility: number;
    intelligence: number;
    luck: number;
  };
}

interface CharacterCardProps {
  character: Character;
  isOwner?: boolean;
  onSelect?: (character: Character) => void;
}

export const CharacterCard = ({ character, isOwner = false, onSelect }: CharacterCardProps) => {
  const getClassColor = (className: string) => {
    const colors: Record<string, string> = {
      'Guerreiro': 'bg-magic-fire',
      'Mago': 'bg-magic-water',
      'Assassino': 'bg-magic-shadow',
      'Paladino': 'bg-magic-light',
      'Druida': 'bg-magic-earth',
      'Arqueiro': 'bg-magic-air'
    };
    return colors[className] || 'bg-primary';
  };

  const getAttributeIcon = (attr: string) => {
    const icons: Record<string, any> = {
      strength: Sword,
      defense: Shield,
      agility: Zap,
      intelligence: Eye,
      luck: Users
    };
    return icons[attr];
  };

  return (
    <Card className="bg-gradient-card border-primary/30 shadow-card hover:shadow-glow transition-all duration-300 group">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-primary/50">
              <AvatarImage src={character.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {character.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-foreground text-lg">{character.name}</CardTitle>
              <Badge className={`${getClassColor(character.class)} text-white text-xs`}>
                {character.class} Nv. {character.level}
              </Badge>
            </div>
          </div>
          {isOwner && (
            <Button 
              variant="epic" 
              size="sm"
              onClick={() => onSelect?.(character)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Selecionar
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Health and Mana Bars */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-destructive" />
            <span className="text-sm text-muted-foreground">HP:</span>
            <span className="text-sm font-bold text-foreground">{character.hp}/{character.maxHp}</span>
          </div>
          <Progress 
            value={(character.hp / character.maxHp) * 100} 
            className="h-2 bg-muted"
          />
          
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-magic-water" />
            <span className="text-sm text-muted-foreground">Mana:</span>
            <span className="text-sm font-bold text-foreground">{character.mana}/{character.maxMana}</span>
          </div>
          <Progress 
            value={(character.mana / character.maxMana) * 100} 
            className="h-2 bg-muted"
          />
        </div>

        {/* Attributes */}
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(character.attributes).map(([attr, value]) => {
            const Icon = getAttributeIcon(attr);
            return (
              <div key={attr} className="flex items-center gap-2 p-2 rounded bg-muted/30">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground capitalize">{attr}:</span>
                <span className="text-sm font-bold text-foreground">{value}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};