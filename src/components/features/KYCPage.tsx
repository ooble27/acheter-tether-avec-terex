import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { KYCForm } from '@/components/features/KYCForm';
import { useScrollToTop } from '@/components/ScrollToTop';

interface KYCPageProps {
  onBack: () => void;
}

export function KYCPage({ onBack }: KYCPageProps) {
  const scrollToTop = useScrollToTop();

  useEffect(() => {
    scrollToTop();
  }, [scrollToTop]);

  return (
    <div className="min-h-screen bg-terex-dark p-4">
      <Button onClick={onBack} variant="ghost" className="mb-4 text-white hover:bg-terex-gray/20">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Retour au profil
      </Button>
      <KYCForm />
    </div>
  );
}
