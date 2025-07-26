import { useState } from "react";
import { GameSelection } from "./GameSelection";
import { CharacterCreation } from "./CharacterCreation";
import { GameDashboard } from "./GameDashboard";
import { Login } from "./Login";

type AppState = 'login' | 'selection' | 'character-creation' | 'game';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [userRole, setUserRole] = useState<'gm' | 'player' | null>(null);
  const [roomCode, setRoomCode] = useState<string>("");
  const [user, setUser] = useState<any>(null);

  const handleRoleSelection = (role: 'gm' | 'player', code?: string) => {
    setUserRole(role);
    setRoomCode(code || "");
    
    if (role === 'gm') {
      setAppState('game');
    } else {
      setAppState('character-creation');
    }
  };

  const handleCharacterCreated = (character: any) => {
    setAppState('game');
  };

  const handleBackToSelection = () => {
    setAppState('selection');
    setUserRole(null);
    setRoomCode("");
  };

  const handleLeaveGame = () => {
    setAppState('selection');
    setUserRole(null);
    setRoomCode("");
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setUserRole(userData.role);
    setAppState('selection');
  };

  switch (appState) {
    case 'login':
      return <Login onLogin={handleLogin} />;
    
    case 'selection':
      return <GameSelection onSelectRole={handleRoleSelection} />;
    
    case 'character-creation':
      return (
        <CharacterCreation 
          onBack={handleBackToSelection}
          onCharacterCreated={handleCharacterCreated}
        />
      );
    
    case 'game':
      return (
        <GameDashboard 
          role={userRole!}
          roomCode={roomCode}
          onLeaveGame={handleLeaveGame}
        />
      );
    
    default:
      return <GameSelection onSelectRole={handleRoleSelection} />;
  }
};

export default Index;
