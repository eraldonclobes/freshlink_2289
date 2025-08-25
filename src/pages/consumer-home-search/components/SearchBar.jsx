import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ onSearch, onSuggestionClick, className = '' }) => {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const inputRef = useRef(null);

    const mockSuggestions = [
        { id: 1, type: 'vendor', name: 'Fazenda Verde Orgânicos', category: 'Vendedor', vendorId: 1 },
        { id: 2, type: 'product', name: 'Tomate Orgânico', category: 'Produto', productId: 1, vendorId: 1 },
        { id: 3, type: 'vendor', name: 'Hortifruti do João', category: 'Vendedor', vendorId: 2 },
        { id: 4, type: 'product', name: 'Alface Hidropônica', category: 'Produto', productId: 2, vendorId: 2 },
        { id: 5, type: 'location', name: 'Vila Madalena', category: 'Localização' },
        { id: 6, type: 'product', name: 'Banana Prata', category: 'Produto', productId: 3, vendorId: 3 },
        { id: 7, type: 'vendor', name: 'Sítio das Frutas', category: 'Vendedor', vendorId: 3 }
    ];

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;
            recognitionInstance.lang = 'pt-BR';

            recognitionInstance.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                onSearch?.(transcript);
                setIsListening(false);
            };

            recognitionInstance.onerror = () => {
                setIsListening(false);
            };

            recognitionInstance.onend = () => {
                setIsListening(false);
            };

            setRecognition(recognitionInstance);
        }
    }, [onSearch]);

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
        onSuggestionClick?.(suggestion);
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

    const startVoiceSearch = () => {
        if (recognition && !isListening) {
            setIsListening(true);
            recognition.start();
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
                        className="w-full pl-10 pr-20 py-3 bg-background border border-border rounded-lg text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                        {query && (
                            <button
                                type="button"
                                onClick={handleClear}
                                className="p-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
                            >
                                <Icon name="X" size={16} />
                            </button>
                        )}
                        {recognition && (
                            <button
                                type="button"
                                onClick={startVoiceSearch}
                                className={`p-1 rounded-full transition-colors duration-200 ${
                                    isListening
                                        ? 'text-error bg-error/10'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                }`}
                            >
                                <Icon name={isListening ? "MicOff" : "Mic"} size={16} />
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {isOpen && suggestions?.length > 0 && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto animate-fade-in">
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