import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dices, Sparkles } from "lucide-react";

interface DiceResult {
  type: string;
  value: number;
  timestamp: number;
}

export const DiceRoller = () => {
  const [results, setResults] = useState<DiceResult[]>([]);
  const [isRolling, setIsRolling] = useState(false);

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  const rollDice = async (sides: number) => {
    setIsRolling(true);
    
    // Simulate rolling animation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const value = Math.floor(Math.random() * sides) + 1;
    const result: DiceResult = {
      type: `D${sides}`,
      value,
      timestamp: Date.now()
    };

    setResults(prev => [result, ...prev.slice(0, 4)]);
    setIsRolling(false);
  };

  const getDiceColor = (type: string) => {
    const colors: Record<string, string> = {
      'D4': 'bg-magic-earth',
      'D6': 'bg-magic-fire', 
      'D8': 'bg-magic-water',
      'D10': 'bg-magic-air',
      'D12': 'bg-magic-shadow',
      'D20': 'bg-primary',
      'D100': 'bg-gradient-magic'
    };
    return colors[type] || 'bg-primary';
  };

  return (
    <Card className="bg-gradient-card border-primary/30 shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2 text-foreground">
          <Dices className="w-6 h-6 text-primary" />
          Sistema de Dados Épico
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-4 md:grid-cols-7 gap-2">
          {diceTypes.map((sides) => (
            <Button
              key={sides}
              variant="epic"
              size="sm"
              onClick={() => rollDice(sides)}
              disabled={isRolling}
              className="relative group"
            >
              <span className="text-xs font-bold">D{sides}</span>
              {isRolling && (
                <Sparkles className="absolute inset-0 w-4 h-4 animate-spin text-primary" />
              )}
            </Button>
          ))}
        </div>

        {results.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Últimos Resultados:</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.timestamp}
                  className={`flex items-center justify-between p-3 rounded-lg border ${index === 0 ? 'border-primary bg-primary/10 animate-glow-pulse' : 'border-border bg-muted/30'}`}
                >
                  <Badge className={`${getDiceColor(result.type)} text-white font-bold`}>
                    {result.type}
                  </Badge>
                  <span className={`text-2xl font-bold ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
                    {result.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};