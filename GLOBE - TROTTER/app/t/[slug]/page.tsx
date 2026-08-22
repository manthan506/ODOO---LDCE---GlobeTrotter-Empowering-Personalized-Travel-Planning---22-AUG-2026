'use client';

import { PublicTripView } from '@/components/community/PublicTripView';

export default function PublicTripPage({ params }: { params: { slug: string } }) {
  return <PublicTripView slug={params.slug} />;
}
