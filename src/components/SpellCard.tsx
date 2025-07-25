import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Zap, Target, TrendingUp, Shuffle } from "lucide-react";

interface Spell {
  id: string;
  name: string;
  level: number;
  element: string;
  manaCost: number;
  damage?: number;
  heal?: number;
  description: string;
  strengths: string[];
  weaknesses: string[];
  synergies: string[];
  evolutionChance: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface SpellCardProps {
  spell: Spell;
  onCast?: (spell: Spell) => void;
  onFuse?: (spell: Spell) => void;
}

export const SpellCard = ({ spell, onCast, onFuse }: SpellCardProps) => {
  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      'Fogo': 'bg-magic-fire',
      'Água': 'bg-magic-water',
      'Terra': 'bg-magic-earth',
      'Ar': 'bg-magic-air',
      'Sombra': 'bg-magic-shadow',
      'Luz': 'bg-magic-light'
    };
    return colors[element] || 'bg-primary';
  };

  const getRarityColor = (rarity: string) => {
    const colors: Record<string, string> = {
      'common': 'border-muted-foreground bg-muted',
      'rare': 'border-magic-water bg-magic-water/20',
      'epic': 'border-primary bg-primary/20',
      'legendary': 'border-magic-light bg-magic-light/20'
    };
    return colors[rarity] || 'border-muted';
  };

  const getRarityGlow = (rarity: string) => {
    const glows: Record<string, string> = {
      'rare': 'shadow-[0_0_20px_hsl(var(--magic-water)/0.3)]',
      'epic': 'shadow-glow',
      'legendary': 'shadow-[0_0_30px_hsl(var(--magic-light)/0.5)] animate-glow-pulse'
    };
    return glows[rarity] || '';
  };

  return (
    <Card className={`bg-gradient-card ${getRarityColor(spell.rarity)} ${getRarityGlow(spell.rarity)} hover:scale-105 transition-all duration-300 max-w-sm`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-foreground text-lg font-bold">{spell.name}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge className={`${getElementColor(spell.element)} text-white text-xs`}>
                {spell.element}
              </Badge>
              <Badge variant="outline" className="text-xs">
                Nível {spell.level}
              </Badge>
              <Badge className={`${getRarityColor(spell.rarity)} text-xs capitalize`}>
                {spell.rarity}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-magic-water">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-bold">{spell.manaCost}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Damage/Heal */}
        {(spell.damage || spell.heal) && (
          <div className="flex items-center justify-center gap-4">
            {spell.damage && (
              <div className="flex items-center gap-2 text-destructive">
                <Target className="w-4 h-4" />
                <span className="font-bold">{spell.damage} dano</span>
              </div>
            )}
            {spell.heal && (
              <div className="flex items-center gap-2 text-accent">
                <Sparkles className="w-4 h-4" />
                <span className="font-bold">{spell.heal} cura</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-muted-foreground italic">{spell.description}</p>

        {/* Evolution Chance */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Chance de Evolução:</span>
            <span className="text-sm font-bold text-primary">{spell.evolutionChance}%</span>
          </div>
          <Progress value={spell.evolutionChance} className="h-2" />
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <h4 className="font-semibold text-accent mb-1">Pontos Fortes:</h4>
            <ul className="space-y-1">
              {spell.strengths.map((strength, index) => (
                <li key={index} className="text-accent/80">• {strength}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-destructive mb-1">Fraquezas:</h4>
            <ul className="space-y-1">
              {spell.weaknesses.map((weakness, index) => (
                <li key={index} className="text-destructive/80">• {weakness}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Synergies */}
        {spell.synergies.length > 0 && (
          <div>
            <h4 className="font-semibold text-primary text-xs mb-1">Sinergias:</h4>
            <div className="flex flex-wrap gap-1">
              {spell.synergies.map((synergy, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {synergy}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button 
            variant="magic" 
            size="sm" 
            className="flex-1"
            onClick={() => onCast?.(spell)}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Lançar
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onFuse?.(spell)}
          >
            <Shuffle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};