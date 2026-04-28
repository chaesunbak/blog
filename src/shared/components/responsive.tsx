'use client';

import type { ReactNode } from 'react';
import { useIsMobile } from '@/shared/hooks/use-is-mobile';

export function Responsive({
  desktop,
  mobile,
}: {
  desktop?: ReactNode;
  mobile?: ReactNode;
}) {
  const isMobile = useIsMobile();

  return isMobile ? mobile : desktop;
}
