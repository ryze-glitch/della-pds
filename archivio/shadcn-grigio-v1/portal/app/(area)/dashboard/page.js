'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { DashboardView } from '../../../components/DashboardView';
import { useAgentProfile } from '../../../components/useAgentProfile';
import { db } from '../../../lib/firebase';

export default function DashboardPage() {
  const { loading, profile } = useAgentProfile();
  const [pratiche, setPratiche] = useState(null);

  useEffect(() => {
    if (loading || !profile) return;
    (async () => {
      try {
        const snap = await getDocs(query(collection(db, 'pratiche'), orderBy('creatoIl', 'desc'), limit(100)));
        setPratiche(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
        setPratiche([]);
      }
    })();
  }, [loading, profile]);

  return <DashboardView profile={profile} pratiche={pratiche} />;
}
