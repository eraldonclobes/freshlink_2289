import React, { useState } from 'react';
import Icon from '../AppIcon';

const FilterDropdown = ({ 
  label, 
  options = [], 
  value, 
  onChange, 
  placeholder = "Selecione...",
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-muted border border-border rounded-lg text-sm font-body font-medium text-foreground hover:bg-muted/80 transition-colors duration-200 whitespace-nowrap"
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <Icon name="ChevronDown" size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-48">
            <div className="max-h-64 overflow-y-auto py-1">
              {options?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => handleOptionSelect(option?.value)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-body hover:bg-muted transition-colors duration-200 ${
                    value === option?.value ? 'bg-primary/10 text-primary' : 'text-foreground'
                  }`}
                >
                  <span className="font-medium">{option?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FilterDropdown;