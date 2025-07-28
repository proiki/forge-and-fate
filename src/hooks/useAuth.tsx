import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User, AuthSession } from '@/lib/supabase'
import { toast } from 'sonner'

interface AuthContextType {
  user: User | null
  session: AuthSession | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string, role: 'gm' | 'player') => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)

  // Verifica se há uma sessão salva no localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('auth_session')
    const savedUser = localStorage.getItem('auth_user')
    
    if (savedSession && savedUser) {
      try {
        setSession(JSON.parse(savedSession))
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem('auth_session')
        localStorage.removeItem('auth_user')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setSession(data.session)
        
        // Salva no localStorage
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        localStorage.setItem('auth_session', JSON.stringify(data.session))
        
        toast.success(`Bem-vindo de volta, ${data.user.name}!`)
        return true
      } else {
        toast.error(data.error || 'Erro ao fazer login')
        return false
      }
    } catch (error) {
      toast.error('Erro de conexão')
      return false
    } finally {
      setLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string, role: 'gm' | 'player'): Promise<boolean> => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, role }),
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        setSession(data.session)
        
        // Salva no localStorage
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        localStorage.setItem('auth_session', JSON.stringify(data.session))
        
        toast.success(`Conta criada com sucesso! Bem-vindo, ${data.user.name}!`)
        return true
      } else {
        toast.error(data.error || 'Erro ao criar conta')
        return false
      }
    } catch (error) {
      toast.error('Erro de conexão')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (session) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        })
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    } finally {
      setUser(null)
      setSession(null)
      localStorage.removeItem('auth_user')
      localStorage.removeItem('auth_session')
      toast.success('Logout realizado com sucesso')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      register,
      logout,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

