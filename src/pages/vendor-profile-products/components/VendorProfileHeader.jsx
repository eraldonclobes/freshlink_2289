import React from 'react';
import { useNavigate } from 'react-router-dom';

import Button from '../../../components/ui/Button';

const VendorProfileHeader = ({ vendor, onShare }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Back Button and Title */}
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              iconName="ArrowLeft"
              onClick={handleBack}
              className="md:hidden"
            />
            <div className="hidden md:block">
              <h1 className="font-heading font-semibold text-foreground">
                {vendor?.name}
              </h1>
              <p className="text-sm font-caption text-muted-foreground">
                {vendor?.location}
              </p>
            </div>
          </div>

          {/* Mobile Title */}
          <div className="flex-1 text-center md:hidden">
            <h1 className="font-heading font-semibold text-foreground">
              {vendor?.name}
            </h1>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              iconName="Share"
              onClick={onShare}
            />
            <Button
              variant="ghost"
              size="icon"
              iconName="Heart"
              className="hidden md:inline-flex"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default VendorProfileHeader;