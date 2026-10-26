'use client';

import { useEffect, useState } from 'react';
import { getGoogleUser } from '../../lib/googleAuth';

// Utente Google corrente (sessione del browser), sempre allineato tra sidebar e moduli.
export function useGoogleUser() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const sync = () => setUser(getGoogleUser());
    sync();
    window.addEventListener('pds-google', sync);
    return () => window.removeEventListener('pds-google', sync);
  }, []);
  return user;
}
