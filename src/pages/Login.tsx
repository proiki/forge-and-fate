import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  LogIn, 
  UserPlus, 
  Crown, 
  Users, 
  Mail, 
  Lock, 
  User,
  ArrowLeft 
} from "lucide-react";
import heroImage from "@/assets/hero-banner.jpg";

interface LoginProps {
  onLogin: (user: { role: 'gm' | 'player', email: string, name: string }) => void;
  onBack?: () => void;
}

export const Login = ({ onLogin, onBack }: LoginProps) => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    name: "", 
    email: "", 
    password: "", 
    confirmPassword: "",
    role: 'player' as 'gm' | 'player'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login API call
    setTimeout(() => {
      if (loginData.email && loginData.password) {
        const mockUser = {
          role: loginData.email.includes('gm') ? 'gm' as const : 'player' as const,
          email: loginData.email,
          name: loginData.email.split('@')[0]
        };
        
        toast.success(`Bem-vindo de volta, ${mockUser.name}!`);
        onLogin(mockUser);
      } else {
        toast.error("Por favor, preencha todos os campos!");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate form
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("As senhas não coincidem!");
      setIsLoading(false);
      return;
    }

    if (!registerData.name || !registerData.email || !registerData.password) {
      toast.error("Por favor, preencha todos os campos!");
      setIsLoading(false);
      return;
    }

    // Simulate register API call
    setTimeout(() => {
      const newUser = {
        role: registerData.role,
        email: registerData.email,
        name: registerData.name
      };
      
      toast.success(`Conta criada com sucesso! Bem-vindo, ${newUser.name}!`);
      onLogin(newUser);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Hero Image & Info */}
        <div className="hidden lg:block">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl">
            <img 
              src={heroImage} 
              alt="RPG Fantasy World" 
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h1 className="text-4xl font-bold text-white mb-4">
                Entre no Mundo da Fantasia
              </h1>
              <p className="text-xl text-white/90 mb-6">
                Crie épicas aventuras, personagens únicos e explore mundos mágicos com seus amigos.
              </p>
              <div className="flex gap-4">
                <Badge className="bg-primary text-primary-foreground px-4 py-2">
                  <Crown className="w-4 h-4 mr-2" />
                  Mestres da Mesa
                </Badge>
                <Badge className="bg-accent text-accent-foreground px-4 py-2">
                  <Users className="w-4 h-4 mr-2" />
                  Aventureiros
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login/Register Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {onBack && (
            <Button 
              variant="ghost" 
              className="mb-4"
              onClick={onBack}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
          )}

          <Card className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground mb-2">
                RPG Online
              </CardTitle>
              <p className="text-muted-foreground">
                Sua aventura épica começa aqui
              </p>
            </CardHeader>
            
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50">
                  <TabsTrigger value="login">
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </TabsTrigger>
                  <TabsTrigger value="register">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Cadastrar
                  </TabsTrigger>
                </TabsList>

                {/* Login Tab */}
                <TabsContent value="login">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 bg-muted border-primary/30 focus:border-primary"
                          value={loginData.email}
                          onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-muted border-primary/30 focus:border-primary"
                          value={loginData.password}
                          onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar na Aventura"}
                      <LogIn className="w-4 h-4 ml-2" />
                    </Button>

                    <div className="text-center text-sm text-muted-foreground">
                      <p>Contas de teste:</p>
                      <p>GM: gm@teste.com | Jogador: player@teste.com</p>
                      <p>Senha: qualquer coisa</p>
                    </div>
                  </form>
                </TabsContent>

                {/* Register Tab */}
                <TabsContent value="register">
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-name">Nome do Aventureiro</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-name"
                          type="text"
                          placeholder="Seu nome épico"
                          className="pl-10 bg-muted border-primary/30 focus:border-primary"
                          value={registerData.name}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="seu@email.com"
                          className="pl-10 bg-muted border-primary/30 focus:border-primary"
                          value={registerData.email}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Tipo de Conta</Label>
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant={registerData.role === 'player' ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setRegisterData(prev => ({ ...prev, role: 'player' }))}
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Jogador
                        </Button>
                        <Button
                          type="button"
                          variant={registerData.role === 'gm' ? 'default' : 'outline'}
                          className="justify-start"
                          onClick={() => setRegisterData(prev => ({ ...prev, role: 'gm' }))}
                        >
                          <Crown className="w-4 h-4 mr-2" />
                          Mestre
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-muted border-primary/30 focus:border-primary"
                          value={registerData.password}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm">Confirmar Senha</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-confirm"
                          type="password"
                          placeholder="••••••••"
                          className="pl-10 bg-muted border-primary/30 focus:border-primary"
                          value={registerData.confirmPassword}
                          onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando conta..." : "Iniciar Jornada"}
                      <UserPlus className="w-4 h-4 ml-2" />
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

              <div className="mt-6 text-center text-xs text-muted-foreground">
                <p>
                  🔒 Esta é uma versão demo. Para funcionalidade completa de login/cadastro,
                  conecte o projeto ao Supabase.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};