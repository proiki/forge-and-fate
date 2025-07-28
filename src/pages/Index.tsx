import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Crown, 
  Users, 
  Dice6, 
  Shield, 
  Sword, 
  Sparkles,
  ArrowRight,
  Star
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-banner.jpg";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Crown,
      title: "Mestres Poderosos",
      description: "Crie e gerencie suas campanhas épicas com ferramentas avançadas de mestre."
    },
    {
      icon: Users,
      title: "Aventureiros Unidos",
      description: "Junte-se a grupos de aventureiros e viva histórias inesquecíveis."
    },
    {
      icon: Dice6,
      title: "Sistema Intuitivo",
      description: "Interface moderna e fácil de usar para focar na diversão."
    },
    {
      icon: Shield,
      title: "Seguro e Confiável",
      description: "Autenticação segura e proteção de dados com Supabase."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero relative overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-magic-water rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-40 w-1.5 h-1.5 bg-magic-fire rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-magic-earth rounded-full animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Badge className="bg-primary/20 text-primary border-primary/30 px-6 py-2 text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              Forge & Fate RPG
            </Badge>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Sua Aventura
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-magic-water">
              Épica Começa
            </span>
            <br />
            Aqui
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
            Crie personagens únicos, explore mundos fantásticos e viva aventuras inesquecíveis 
            com seus amigos em nossa plataforma de RPG online.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="hero" 
              size="lg" 
              className="text-lg px-8 py-6"
              onClick={() => navigate('/login')}
            >
              Começar Aventura
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 border-white/30 text-white hover:bg-white/10"
              onClick={() => navigate('/login')}
            >
              Já tenho conta
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm hover:scale-105 transition-transform duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Role Selection Preview */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm group hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Seja um Mestre</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Crie mundos épicos, gerencie campanhas e guie seus jogadores através de aventuras inesquecíveis.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Criação de Mesas</Badge>
                <Badge variant="outline">Gerenciar Jogadores</Badge>
                <Badge variant="outline">Controle Total</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm group hover:scale-105 transition-transform duration-300">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                <Sword className="w-8 h-8 text-accent-foreground" />
              </div>
              <CardTitle className="text-2xl">Seja um Aventureiro</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground">
                Crie personagens únicos, junte-se a grupos e explore mundos fantásticos cheios de mistérios.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Badge variant="outline">Criação de Personagens</Badge>
                <Badge variant="outline">Participar de Mesas</Badge>
                <Badge variant="outline">Aventuras Épicas</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="bg-gradient-card border-primary/30 shadow-2xl backdrop-blur-sm max-w-2xl mx-auto">
            <CardContent className="p-8">
              <div className="flex justify-center mb-4">
                <div className="flex -space-x-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">
                Pronto para sua próxima aventura?
              </h3>
              <p className="text-muted-foreground mb-6">
                Junte-se a milhares de aventureiros e mestres que já estão criando histórias épicas.
              </p>
              <Button 
                variant="hero" 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => navigate('/login')}
              >
                Entrar na Aventura
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;

