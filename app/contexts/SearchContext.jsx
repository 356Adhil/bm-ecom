// contexts/SearchContext.jsx
'use client';
import { createContext, useContext } from 'react';
import { useSearch } from '@/app/hooks/useSearch';
import { featuredProducts } from '@/app/data/products';

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const searchProps = useSearch(featuredProducts);

  return <SearchContext.Provider value={searchProps}>{children}</SearchContext.Provider>;
}

export function useSearchContext() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
}
