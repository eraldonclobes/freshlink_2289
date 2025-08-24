import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ onSearch, className = '' }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);

  const mockSuggestions = [
    { id: 1, type: 'vendor', name: 'Fazenda Verde Orgânicos', category: 'Vendedor' },
    { id: 2, type: 'product', name: 'Tomate Orgânico', category: 'Produto' },
    { id: 3, type: 'vendor', name: 'Hortifruti do João', category: 'Vendedor' },
    { id: 4, type: 'product', name: 'Alface Hidropônica', category: 'Produto' },
    { id: 5, type: 'location', name: 'Vila Madalena', category: 'Localização' },
    { id: 6, type: 'product', name: 'Banana Prata', category: 'Produto' },
    { id: 7, type: 'vendor', name: 'Sítio das Frutas', category: 'Vendedor' }
  ];

  useEffect(() => {
    if (query?.length > 1) {
      const filtered = mockSuggestions?.filter(item =>
        item?.name?.toLowerCase()?.includes(query?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 5));
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  }, [query]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (query?.trim()) {
      onSearch(query?.trim());
      setIsOpen(false);
      inputRef?.current?.blur();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion?.name);
    onSearch(suggestion?.name);
    setIsOpen(false);
    inputRef?.current?.blur();
  };

  const handleInputChange = (e) => {
    setQuery(e?.target?.value);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    inputRef?.current?.focus();
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'vendor': return 'Store';
      case 'product': return 'Apple';
      case 'location': return 'MapPin';
      default: return 'Search';
    }
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Icon 
            name="Search" 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar produtos ou vendedores..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query?.length > 1 && setIsOpen(true)}
            className="w-full pl-10 pr-10 py-3 bg-muted border border-border rounded-lg text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
      </form>
      {isOpen && suggestions?.length > 0 && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
            {suggestions?.map((suggestion) => (
              <button
                key={suggestion?.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-muted transition-colors duration-200"
              >
                <Icon name={getIconForType(suggestion?.type)} size={16} className="text-muted-foreground" />
                <div className="flex-1">
                  <span className="text-sm font-body font-medium text-foreground">{suggestion?.name}</span>
                  <span className="ml-2 text-xs font-caption text-muted-foreground">{suggestion?.category}</span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SearchBar;