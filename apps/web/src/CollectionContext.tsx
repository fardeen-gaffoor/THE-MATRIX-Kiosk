import React, { createContext, useContext, useState, ReactNode } from 'react';

type CollectionItem = {
  id: string;
  title: string;
  type: string;
};

type CollectionContextType = {
  tray: CollectionItem[];
  addToTray: (item: CollectionItem) => void;
  removeFromTray: (id: string) => void;
  clearTray: () => void;
};

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function CollectionProvider({ children }: { children: ReactNode }) {
  const [tray, setTray] = useState<CollectionItem[]>([]);

  const addToTray = (item: CollectionItem) => {
    if (!tray.find(i => i.id === item.id)) {
      setTray([...tray, item]);
    }
  };

  const removeFromTray = (id: string) => {
    setTray(tray.filter(i => i.id !== id));
  };

  const clearTray = () => setTray([]);

  return (
    <CollectionContext.Provider value={{ tray, addToTray, removeFromTray, clearTray }}>
      {children}
    </CollectionContext.Provider>
  );
}

export function useCollection() {
  const context = useContext(CollectionContext);
  if (!context) throw new Error('useCollection must be used within CollectionProvider');
  return context;
}
