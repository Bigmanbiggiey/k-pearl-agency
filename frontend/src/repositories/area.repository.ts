import { normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

export interface Area {
  id: string;
  county: string;
  name: string;
  slug: string;
  sortOrder: number;
}

interface AreaRow {
  id: string;
  county: string;
  name: string;
  slug: string;
  sort_order: number;
}

export const areaRepository = {
  async listActive(): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('id, county, name, slug, sort_order')
      .eq('is_active', true)
      .order('county', { ascending: true })
      .order('sort_order', { ascending: true });
    if (error) throw normalizeSupabaseError(error);

    return ((data ?? []) as AreaRow[]).map((row) => ({
      id: row.id,
      county: row.county,
      name: row.name,
      slug: row.slug,
      sortOrder: row.sort_order,
    }));
  },
};
