import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { 
  Skull, 
  Shield, 
  Sword, 
  Eye, 
  Zap,
  Heart,
  Star
} from "lucide-react";

interface Monster {
  id: string;
  name: string;
  type: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  defense: number;
  speed: number;
  abilities: string[];
  weaknesses: string[];
  resistances: string[];
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

interface MonsterCardProps {
  monster: Monster;
  isGM?: boolean;
  onAttack?: (monster: Monster) => void;
  onDefeat?: (monster: Monster) => void;
  onEdit?: (monster: Monster) => void;
}

const rarityColors = {
  common: 'bg-slate-500',
  rare: 'bg-blue-500',
  epic: 'bg-purple-500',
  legendary: 'bg-yellow-500'
};

export const MonsterCard = ({ monster, isGM = false, onAttack, onDefeat, onEdit }: MonsterCardProps) => {
  const [currentHp, setCurrentHp] = useState(monster.hp);
  const [isDefeated, setIsDefeated] = useState(false);

  const handleDamage = (damage: number) => {
    const newHp = Math.max(0, currentHp - damage);
    setCurrentHp(newHp);
    
    if (newHp === 0 && !isDefeated) {
      setIsDefeated(true);
      toast.success(`${monster.name} foi derrotado!`);
      onDefeat?.(monster);
    } else {
      toast.success(`${monster.name} recebeu ${damage} de dano!`);
    }
  };

  const handleHeal = (heal: number) => {
    const newHp = Math.min(monster.maxHp, currentHp + heal);
    setCurrentHp(newHp);
    toast.success(`${monster.name} recuperou ${heal} HP!`);
  };

  const handleAttackPlayer = () => {
    toast.success(`${monster.name} atacou! Dano: ${monster.attack}`);
    onAttack?.(monster);
  };

  const hpPercentage = (currentHp / monster.maxHp) * 100;

  return (
    <Card className={`transition-all hover:shadow-lg border-2 ${
      isDefeated 
        ? 'opacity-50 border-red-500' 
        : 'border-border hover:border-primary/50'
    } bg-gradient-card`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-foreground flex items-center gap-2">
            <span className="text-2xl">{monster.icon}</span>
            {monster.name}
            {isDefeated && <Skull className="w-5 h-5 text-red-500" />}
          </CardTitle>
          <div className="flex gap-2">
            <Badge className={`${rarityColors[monster.rarity]} text-white`}>
              {monster.rarity}
            </Badge>
            <Badge variant="outline">
              Nível {monster.level}
            </Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{monster.type}</p>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* HP Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Vida</span>
            <span className="text-foreground">{currentHp}/{monster.maxHp}</span>
          </div>
          <Progress 
            value={hpPercentage} 
            className="h-2"
            style={{
              background: hpPercentage > 50 ? '#22c55e' : 
                         hpPercentage > 25 ? '#f59e0b' : '#ef4444'
            }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-red-500">
              <Sword className="w-4 h-4" />
              <span className="font-medium">{monster.attack}</span>
            </div>
            <span className="text-muted-foreground">Ataque</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-blue-500">
              <Shield className="w-4 h-4" />
              <span className="font-medium">{monster.defense}</span>
            </div>
            <span className="text-muted-foreground">Defesa</span>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 text-green-500">
              <Zap className="w-4 h-4" />
              <span className="font-medium">{monster.speed}</span>
            </div>
            <span className="text-muted-foreground">Velocidade</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground">
          {monster.description}
        </p>

        {/* Abilities */}
        {monster.abilities.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-1">
              <Star className="w-4 h-4 text-primary" />
              Habilidades
            </h4>
            <div className="flex flex-wrap gap-1">
              {monster.abilities.map((ability, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {ability}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Weaknesses & Resistances */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          {monster.weaknesses.length > 0 && (
            <div>
              <h5 className="font-medium text-red-500 mb-1">Fraquezas</h5>
              <div className="space-y-1">
                {monster.weaknesses.map((weakness, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-red-500 border-red-500">
                    {weakness}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {monster.resistances.length > 0 && (
            <div>
              <h5 className="font-medium text-green-500 mb-1">Resistências</h5>
              <div className="space-y-1">
                {monster.resistances.map((resistance, index) => (
                  <Badge key={index} variant="outline" className="text-xs text-green-500 border-green-500">
                    {resistance}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {!isDefeated && (
          <div className="space-y-2">
            {isGM ? (
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleAttackPlayer}
                >
                  <Sword className="w-4 h-4 mr-1" />
                  Atacar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onEdit?.(monster)}
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Editar
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleDamage(10)}
                >
                  -10 HP
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleHeal(10)}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  +10 HP
                </Button>
              </div>
            ) : (
              <Button 
                variant="hero" 
                size="sm" 
                className="w-full"
                onClick={handleAttackPlayer}
              >
                <Sword className="w-4 h-4 mr-2" />
                Atacar {monster.name}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

