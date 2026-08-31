import { normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';

export interface Area {
  id: string;
  county: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

interface AreaRow {
  id: string;
  county: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

const COLUMNS = 'id, county, name, slug, sort_order, is_active';

function map(row: AreaRow): Area {
  return {
    id: row.id,
    county: row.county,
    name: row.name,
    slug: row.slug,
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

export interface AreaInput {
  county: string;
  name: string;
  slug: string;
  sortOrder: number;
}

export const areaRepository = {
  async listActive(): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select(COLUMNS)
      .eq('is_active', true)
      .order('county', { ascending: true })
      .order('sort_order', { ascending: true });
    if (error) throw normalizeSupabaseError(error);
    return ((data ?? []) as AreaRow[]).map(map);
  },

  /** Admin — every area including inactive ones. */
  async listAll(): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select(COLUMNS)
      .order('county', { ascending: true })
      .order('sort_order', { ascending: true });
    if (error) throw normalizeSupabaseError(error);
    return ((data ?? []) as AreaRow[]).map(map);
  },

  async create(input: AreaInput): Promise<void> {
    const { error } = await supabase.from('areas').insert({
      county: input.county,
      name: input.name,
      slug: input.slug,
      sort_order: input.sortOrder,
    });
    if (error) throw normalizeSupabaseError(error);
  },

  async update(id: string, input: AreaInput): Promise<void> {
    const { error } = await supabase
      .from('areas')
      .update({
        county: input.county,
        name: input.name,
        slug: input.slug,
        sort_order: input.sortOrder,
      })
      .eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async setActive(id: string, isActive: boolean): Promise<void> {
    const { error } = await supabase.from('areas').update({ is_active: isActive }).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },
};
