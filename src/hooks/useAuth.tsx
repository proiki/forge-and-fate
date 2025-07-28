import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export type User = {
  id: string
  email: string
  name: string
  role: 'gm' | 'player'
}

export type AuthSession = {
  access_token: string
  refresh_token: string
}

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
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast.error(error.message || 'Erro ao fazer login')
        return false
      }

      if (data.user && data.session) {
        // Buscar dados do perfil do usuário
        const { data: profile } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', data.user.id)
          .single()

        const userData: User = {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.email!,
          role: profile?.role || 'player'
        }

        const sessionData: AuthSession = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        }

        setUser(userData)
        setSession(sessionData)
        
        // Salva no localStorage
        localStorage.setItem('auth_user', JSON.stringify(userData))
        localStorage.setItem('auth_session', JSON.stringify(sessionData))
        
        toast.success(`Bem-vindo de volta, ${userData.name}!`)
        return true
      }

      return false
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
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      })

      if (error) {
        toast.error(error.message || 'Erro ao criar conta')
        return false
      }

      if (data.user && data.session) {
        // Criar perfil do usuário
        await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              name,
              email,
              role
            }
          ])

        const userData: User = {
          id: data.user.id,
          email: data.user.email!,
          name,
          role
        }

        const sessionData: AuthSession = {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token
        }

        setUser(userData)
        setSession(sessionData)
        
        // Salva no localStorage
        localStorage.setItem('auth_user', JSON.stringify(userData))
        localStorage.setItem('auth_session', JSON.stringify(sessionData))
        
        toast.success(`Conta criada com sucesso! Bem-vindo, ${userData.name}!`)
        return true
      }

      return false
    } catch (error) {
      toast.error('Erro de conexão')
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut()
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

