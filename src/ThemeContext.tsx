import { createContext, useContext, useState } from 'react';

type ThemeCtx = { isDark: boolean; toggle: () => void };
export const ThemeContext = createContext<ThemeCtx>({ isDark: true, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);
  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d) }}>
      {children}
    </ThemeContext.Provider>
  );
}
