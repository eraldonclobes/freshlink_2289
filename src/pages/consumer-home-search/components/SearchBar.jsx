import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ onSearch, currentLocation, onLocationChange, className = '' }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLocationOpen, setIsLocationOpen] = useState(false);
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

    const locations = [
        { id: 1, name: "São Paulo, SP", distance: "Atual" },
        { id: 2, name: "Rio de Janeiro, RJ", distance: "450 km" },
        { id: 3, name: "Belo Horizonte, MG", distance: "586 km" },
        { id: 4, name: "Brasília, DF", distance: "1.015 km" },
        { id: 5, name: "Salvador, BA", distance: "1.962 km" }
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

    const handleLocationSelect = (location) => {
        onLocationChange(location);
        setIsLocationOpen(false);
    };

    const handleDetectLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation?.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position?.coords;
                    onLocationChange({
                        id: 'current',
                        name: 'Localização Atual',
                        distance: 'Detectada',
                        coords: { lat: latitude, lng: longitude }
                    });
                    setIsLocationOpen(false);
                },
                (error) => {
                    console.error('Erro ao obter localização:', error);
                }
            );
        }
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
        <div className={`flex items-center space-x-3 ${className}`}>
            {/* Location Selector */}
            <div className="relative">
                <button
                    onClick={() => setIsLocationOpen(!isLocationOpen)}
                    className="flex items-center space-x-2 px-3 py-3 bg-muted border border-border rounded-lg text-sm font-body font-medium text-foreground hover:bg-muted/80 transition-colors duration-200 whitespace-nowrap"
                >
                    <Icon name="MapPin" size={16} className="text-primary" />
                    <span className="hidden sm:inline">{currentLocation?.name}</span>
                    <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isLocationOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLocationOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsLocationOpen(false)}
                        />
                        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-64">
                            <div className="p-3 border-b border-border">
                                <button
                                    onClick={handleDetectLocation}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-sm font-body font-medium text-primary hover:bg-primary/10 rounded-lg transition-colors duration-200"
                                >
                                    <Icon name="Navigation" size={16} />
                                    <span>Detectar minha localização</span>
                                </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {locations?.map((location) => (
                                    <button
                                        key={location?.id}
                                        onClick={() => handleLocationSelect(location)}
                                        className={`w-full flex items-center justify-between px-4 py-3 text-sm font-body hover:bg-muted transition-colors duration-200 ${currentLocation?.id === location?.id ? 'bg-primary/10 text-primary' : 'text-foreground'
                                            }`}
                                    >
                                        <span className="font-medium">{location?.name}</span>
                                        <span className="text-muted-foreground text-xs">{location?.distance}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Search Bar */}
            <div className="relative flex-1">
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
        </div>
    );
};

export default SearchBar;