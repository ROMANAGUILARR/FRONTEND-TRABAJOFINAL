import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { MOCK_PUNTOS } from '../services/mockData';

/**
 * Context para manejar la autenticación y permisos de forma global
 */
const AuthContext = createContext(null);

/**
 * Provider que envuelve la aplicación y comparte el estado de autenticación
 */
export function AuthProvider({ children }) {
  const API_BASE = import.meta.env.VITE_API_URL|| 'http://localhost:8081';
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    canRegister: false,
    canTrack: false,
    canAccessEducation: false,
    isAdmin: false
  });

  // Verificar autenticación al montar el componente
  useEffect(() => {
    const token = localStorage.getItem('token');
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const puntos = parseInt(localStorage.getItem('puntos') || '0', 10);
    const savedPermissions = localStorage.getItem('permissions');
    const rol = localStorage.getItem('rol');
    if (token && nombreUsuario) {
      setIsAuthenticated(true);
      setUser({ nombreUsuario, puntos, rol });
      if (savedPermissions) {
        setPermissions(JSON.parse(savedPermissions));
      } else {
        setPermissions({
          canRegister: true,
          canTrack: true,
          canAccessEducation: true,
          isAdmin: false
        });
      }
    }
    setIsLoading(false);
  }, []);

  // Función de login
  const login = useCallback(async (nombreUsuario, contrasena) => {
    // Modo demo: entra sin backend
    if (nombreUsuario === 'GASPER' && contrasena === 'Palacios10') {
      const demoRol = 'CIUDADANO';
      const demoPermisos = { canRegister: true, canTrack: true, canAccessEducation: true, isAdmin: false };
      localStorage.setItem('token', 'demo-token');
      localStorage.setItem('nombreUsuario', 'Itzair Roman');
      localStorage.setItem('puntos', String(MOCK_PUNTOS));
      localStorage.setItem('rol', demoRol);
      localStorage.setItem('permissions', JSON.stringify(demoPermisos));
      setIsAuthenticated(true);
      setUser({ nombreUsuario: 'Itzair Roman', puntos: MOCK_PUNTOS, rol: demoRol });
      setPermissions(demoPermisos);
      return { success: true, rol: demoRol };
    }

    // Modo demo admin
    if (nombreUsuario === 'admin' && contrasena === 'Palacios13579') {
      const demoRol = 'ADMIN';
      const demoPermisos = { canRegister: false, canTrack: false, canAccessEducation: false, isAdmin: true };
      localStorage.setItem('token', 'demo-token-admin');
      localStorage.setItem('nombreUsuario', 'Ernesto');
      localStorage.setItem('puntos', '0');
      localStorage.setItem('rol', demoRol);
      localStorage.setItem('permissions', JSON.stringify(demoPermisos));
      setIsAuthenticated(true);
      setUser({ nombreUsuario: 'Ernesto', puntos: 0, rol: demoRol });
      setPermissions(demoPermisos);
      return { success: true, rol: demoRol };
    }

    // Si no es GASPER ni admin, rechazar
    return { success: false, error: 'Usuario o contraseña incorrectos' };
  }, []);

  // Función de logout
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('nombreUsuario');
    localStorage.removeItem('puntos');
    localStorage.removeItem('permissions');
    localStorage.removeItem('rol');
    
    setIsAuthenticated(false);
    setUser(null);
    setPermissions({
      canRegister: false,
      canTrack: false,
      canAccessEducation: false,
      isAdmin: false
    });
  }, []);

  // Verificar si tiene permiso para un módulo específico
 const hasPermission = useCallback((module) => {
  if (!isAuthenticated || !user?.rol) return false;

  const modulePermissions = {
    registro: ['CIUDADANO'],
    seguimiento: ['CIUDADANO'],
    educacion: ['CIUDADANO'],
    insignias: ['CIUDADANO'],
    ciudadanos: ['ADMIN'],
    gestion: ['ADMIN'],
    dashboard: ['ADMIN'],
  };

  return modulePermissions[module]?.includes(user.rol) ?? false;
}, [isAuthenticated, user]);

  // Verificar si es administrador
  const isAdmin = useCallback(() => {
    return isAuthenticated && user?.rol === 'ADMIN';
  }, [isAuthenticated, user]);

  // Actualizar puntos del usuario
  const updatePuntos = useCallback((nuevosPuntos) => {
    localStorage.setItem('puntos', nuevosPuntos);
    setUser((prev) => ({ ...prev, puntos: nuevosPuntos }));
  }, []);

  const value = {
    isAuthenticated,
    user,
    isLoading,
    permissions,
    login,
    logout,
    hasPermission,
    isAdmin,
    updatePuntos
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

/**
 * Hook personalizado para manejar la autenticación y permisos
 * @returns {Object} Estado de autenticación y funciones relacionadas
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

/**
 * Hook para verificar permisos en componentes específicos
 * @param {string} module - Nombre del módulo a verificar
 * @returns {boolean} True si el usuario tiene permiso
 */
export function useModulePermission(module) {
  const { isAuthenticated, hasPermission, isLoading } = useAuth();
  
  if (isLoading) return null; // Still loading
  if (!isAuthenticated) return false;
  
  return hasPermission(module);
}
