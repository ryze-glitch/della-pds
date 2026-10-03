'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

// Hook condiviso da dashboard e candidature: entrambe sono pagine
// protette, accessibili solo agli agenti presenti nella raccolta
// Firestore "auth-sito" (documento con ID uguale all'ID Discord). Il
// Worker di login assegna come uid Firebase "discord:<ID>", quindi il
// prefisso va tolto prima di cercare il documento.
export function useAgentProfile() {
  const [state, setState] = useState({ loading: true, profile: null, discordId: null });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.href = '/login';
        return;
      }

      const discordId = user.uid.startsWith('discord:') ? user.uid.slice('discord:'.length) : user.uid;

      let profile = null;
      try {
        const snap = await getDoc(doc(db, 'auth-sito', discordId));
        if (snap.exists()) profile = snap.data();
      } catch (err) {
        console.error(err);
      }

      if (!profile) {
        await signOut(auth);
        window.location.href = '/login?denied=1';
        return;
      }

      setState({ loading: false, profile, discordId });
    });

    return unsubscribe;
  }, []);

  async function logout() {
    try {
      await signOut(auth);
      window.location.href = '/login';
    } catch (err) {
      console.error(err);
    }
  }

  return { ...state, logout };
}
