import { useAuth } from './AuthContext';
import { translations } from './translations';
import type { Translation } from './types';

export function useTranslation(): Translation {
  const { language } = useAuth();
  return translations[language];
}

export default useTranslation;
