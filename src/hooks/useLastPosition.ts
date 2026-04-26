import { useState, useEffect } from 'react';
import StorageService from '@/services/StorageService';
import { DEFAULT_LAST_POSITION } from '@/constants/Defaults';
import { LastPosition } from '@/types/bible';

export function useLastPosition() {
  const [lastPosition, setLastPosition] = useState<LastPosition>(
    DEFAULT_LAST_POSITION
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    StorageService.position.get().then(pos => {
      setLastPosition(pos);
      setIsLoading(false);
    });
  }, []);

  return { lastPosition, isLoading };
}