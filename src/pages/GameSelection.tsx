import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Dice6, MapPin, Plus, LogOut, UserCheck, UserX, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import heroBanner from "@/assets/hero-banner.jpg";

interface User {
  role: 'gm' | 'player';
  email: string;
  name: string;
}

interface GameSelectionProps {
  user: User;
  onLogout: () => void;
}

interface Game {
  id: number;
  title: string;
  description: string;
  gm_name: string;
  max_players: number;
  current_players: number;
  game_code: string;
  created_at: string;
}

interface GameRequest {
  id: number;
  game_id: number;
  player_name: string;
  player_email: string;
  status: 'pending' | 'approved' | 'rejected';
  message: string;
  created_at: string;
}

export default function GameSelection({ user, onLogout }: GameSelectionProps) {
  const [games, setGames] = useState<Game[]>([]);
  const [requests, setRequests] = useState<GameRequest[]>([]);
  const [roomCode, setRoomCode] = useState("");
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGame, setNewGame] = useState({
    title: "",
    description: "",
    max_players: 6
  });
  const [joinMessage, setJoinMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { session, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
    if (user.role === 'gm') {
      loadRequests();
    }
  }, [user.role]);

  const apiCall = async (url: string, options: RequestInit = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(session && { 'Authorization': `Bearer ${session.access_token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erro na requisição');
    }

    return response.json();
  };

  const loadGames = async () => {
    try {
      const data = await apiCall('/api/games');
      setGames(data.games);
    } catch (error) {
      console.error('Erro ao carregar jogos:', error);
    }
  };

  const loadRequests = async () => {
    try {
      // Para cada jogo do GM, buscar as solicitações
      const gameRequests: GameRequest[] = [];
      for (const game of games) {
        try {
          const data = await apiCall(`/api/games/${game.id}/requests`);
          gameRequests.push(...data.requests);
        } catch (error) {
          console.error(`Erro ao carregar solicitações do jogo ${game.id}:`, error);
        }
      }
      setRequests(gameRequests);
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error);
    }
  };

  const handleCreateGame = async () => {
    if (!newGame.title.trim()) {
      toast.error("Título é obrigatório!");
      return;
    }

    setLoading(true);
    try {
      const data = await apiCall('/api/games', {
        method: 'POST',
        body: JSON.stringify(newGame),
      });

      toast.success(`Mesa criada! Código: ${data.game.game_code}`);
      setShowCreateForm(false);
      setNewGame({ title: "", description: "", max_players: 6 });
      loadGames();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao criar jogo');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!roomCode.trim()) {
      toast.error("Digite um código válido!");
      return;
    }

    setLoading(true);
    try {
      await apiCall('/api/games/join', {
        method: 'POST',
        body: JSON.stringify({
          game_code: roomCode.toUpperCase(),
          message: joinMessage
        }),
      });

      toast.success("Solicitação enviada! Aguarde a aprovação do mestre.");
      setShowJoinForm(false);
      setRoomCode("");
      setJoinMessage("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao solicitar participação');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId: number, action: 'approve' | 'reject') => {
    setLoading(true);
    try {
      const request = requests.find(r => r.id === requestId);
      if (!request) return;

      await apiCall(`/api/games/${request.game_id}/requests/${requestId}`, {
        method: 'PUT',
        body: JSON.stringify({ action }),
      });

      toast.success(`Solicitação ${action === 'approve' ? 'aprovada' : 'rejeitada'}!`);
      loadRequests();
      loadGames();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao processar solicitação');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const enterGame = (gameId: number) => {
    navigate(`/game/${gameId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{ backgroundImage: `url(${heroBanner})` }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-magic-water rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-magic-fire rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-magic-earth rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Bem-vindo, {user.name}!
            </h1>
            <div className="flex items-center gap-2">
              {user.role === 'gm' ? (
                <Badge className="bg-primary text-primary-foreground">
                  <Crown className="w-4 h-4 mr-1" />
                  Mestre
                </Badge>
              ) : (
                <Badge className="bg-accent text-accent-foreground">
                  <Users className="w-4 h-4 mr-1" />
                  Aventureiro
                </Badge>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Actions */}
          <div className="lg:col-span-2 space-y-6">
            {user.role === 'gm' ? (
              <Card className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5" />
                    Suas Mesas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                    <DialogTrigger asChild>
                      <Button variant="hero" size="lg" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Criar Nova Mesa
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Nova Mesa</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Título da Mesa</Label>
                          <Input
                            id="title"
                            value={newGame.title}
                            onChange={(e) => setNewGame(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Ex: Aventuras em Faerûn"
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Descrição</Label>
                          <Textarea
                            id="description"
                            value={newGame.description}
                            onChange={(e) => setNewGame(prev => ({ ...prev, description: e.target.value }))}
                            placeholder="Descreva sua campanha..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="max_players">Máximo de Jogadores</Label>
                          <Input
                            id="max_players"
                            type="number"
                            min="1"
                            max="10"
                            value={newGame.max_players}
                            onChange={(e) => setNewGame(prev => ({ ...prev, max_players: parseInt(e.target.value) || 6 }))}
                          />
                        </div>
                        <Button onClick={handleCreateGame} disabled={loading} className="w-full">
                          {loading ? "Criando..." : "Criar Mesa"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {games.map((game) => (
                    <Card key={game.id} className="border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{game.title}</h3>
                          <Badge variant="outline">
                            Código: {game.game_code}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {game.current_players}/{game.max_players} jogadores
                          </span>
                          <Button size="sm" onClick={() => enterGame(game.id)}>
                            <MapPin className="w-4 h-4 mr-1" />
                            Entrar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            ) : (
              <Card className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Suas Aventuras
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Dialog open={showJoinForm} onOpenChange={setShowJoinForm}>
                    <DialogTrigger asChild>
                      <Button variant="hero" size="lg" className="w-full">
                        <Dice6 className="w-4 h-4 mr-2" />
                        Solicitar Participação
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Solicitar Participação</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="roomCode">Código da Mesa</Label>
                          <Input
                            id="roomCode"
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                            placeholder="Digite o código da mesa"
                            maxLength={6}
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Mensagem para o Mestre (opcional)</Label>
                          <Textarea
                            id="message"
                            value={joinMessage}
                            onChange={(e) => setJoinMessage(e.target.value)}
                            placeholder="Conte um pouco sobre você ou seu personagem..."
                          />
                        </div>
                        <Button onClick={handleJoinGame} disabled={loading} className="w-full">
                          {loading ? "Enviando..." : "Enviar Solicitação"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {games.map((game) => (
                    <Card key={game.id} className="border-primary/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold">{game.title}</h3>
                          <Badge variant="outline">
                            Mestre: {game.gm_name}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{game.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">
                            {game.current_players}/{game.max_players} jogadores
                          </span>
                          <Button size="sm" onClick={() => enterGame(game.id)}>
                            <MapPin className="w-4 h-4 mr-1" />
                            Entrar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {user.role === 'gm' && (
              <Card className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Solicitações Pendentes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {requests.filter(r => r.status === 'pending').map((request) => (
                    <Card key={request.id} className="border-yellow-500/30">
                      <CardContent className="p-3">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-sm">{request.player_name}</p>
                            <p className="text-xs text-muted-foreground">{request.player_email}</p>
                          </div>
                        </div>
                        {request.message && (
                          <p className="text-xs text-muted-foreground mb-2">"{request.message}"</p>
                        )}
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => handleRequestAction(request.id, 'approve')}
                            disabled={loading}
                          >
                            <UserCheck className="w-3 h-3 mr-1" />
                            Aprovar
                          </Button>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleRequestAction(request.id, 'reject')}
                            disabled={loading}
                          >
                            <UserX className="w-3 h-3 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {requests.filter(r => r.status === 'pending').length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Nenhuma solicitação pendente
                    </p>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Mesas ativas:</span>
                    <span className="font-medium">{games.length}</span>
                  </div>
                  {user.role === 'gm' && (
                    <div className="flex justify-between">
                      <span className="text-sm">Solicitações:</span>
                      <span className="font-medium">{requests.filter(r => r.status === 'pending').length}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

