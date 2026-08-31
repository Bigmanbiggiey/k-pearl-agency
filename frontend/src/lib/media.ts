import { env } from '@/lib/env';

const BUCKET = 'property-media';

/** Public URL for an object in the property-media bucket. */
export function propertyImageUrl(storagePath: string): string {
  return `${env.VITE_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${storagePath}`;
}
