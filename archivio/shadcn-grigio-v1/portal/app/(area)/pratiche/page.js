'use client';

import { PraticheView } from '../../../components/PraticheView';
import { useAgentProfile } from '../../../components/useAgentProfile';

export default function PratichePage() {
  const { loading, profile, discordId } = useAgentProfile();
  return <PraticheView authLoading={loading} profile={profile} discordId={discordId} />;
}
