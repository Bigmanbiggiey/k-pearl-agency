import { normalizeSupabaseError } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { PropertyFormValues, PropertySearchInput } from '@/schemas';
import type {
  ListingType,
  PricePeriod,
  PropertyDetail,
  PropertyListResult,
  PropertyMedia,
  PropertyStatus,
  PropertySummary,
  PropertyType,
  StaffPropertyDetail,
  StaffPropertyListItem,
  StaffPropertyListResult,
} from '@/types';

/*
 * Property data access. Public read paths go through the `public_properties` /
 * `public_property_media` views, which drop staff-only columns and expose only
 * published listings (docs/database.md v2.0). Write/lifecycle methods arrive in
 * Phase 6.
 */

const PUBLIC_PROPERTY_VIEW = 'public_properties';
const PUBLIC_MEDIA_VIEW = 'public_property_media';

interface PublicPropertyRow {
  id: string;
  title: string;
  slug: string;
  reference_code: string;
  listing_type: string;
  price_period: string | null;
  property_type: string;
  price: number | null;
  currency: string;
  area_id: string | null;
  area_name: string | null;
  area_county: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size_value: number | null;
  size_unit: string | null;
  description: string;
  amenities: unknown;
  featured: boolean;
  verified: boolean;
  available_from: string | null;
  published_at: string | null;
  created_at: string;
}

interface PublicMediaRow {
  id: string;
  property_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  is_cover: boolean;
  created_at: string;
}

function toStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : [];
}

function mapMedia(row: PublicMediaRow): PropertyMedia {
  return {
    id: row.id,
    propertyId: row.property_id,
    storagePath: row.storage_path,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    isCover: row.is_cover,
  };
}

function mapSummary(row: PublicPropertyRow, cover: PublicMediaRow | undefined): PropertySummary {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    referenceCode: row.reference_code,
    listingType: row.listing_type as ListingType,
    pricePeriod: (row.price_period as PricePeriod | null) ?? null,
    propertyType: row.property_type as PropertyType,
    price: row.price,
    currency: row.currency,
    areaId: row.area_id,
    areaName: row.area_name,
    areaCounty: row.area_county,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    featured: row.featured,
    verified: row.verified,
    coverImage: cover ? mapMedia(cover) : null,
  };
}

function mapDetail(row: PublicPropertyRow, media: PublicMediaRow[]): PropertyDetail {
  const cover = media.find((m) => m.is_cover) ?? media[0];
  return {
    ...mapSummary(row, cover),
    sizeValue: row.size_value,
    sizeUnit: row.size_unit,
    description: row.description,
    amenities: toStringArray(row.amenities),
    availableFrom: row.available_from,
    publishedAt: row.published_at,
    media: media.map(mapMedia),
  };
}

async function coversFor(propertyIds: string[]): Promise<Map<string, PublicMediaRow>> {
  if (propertyIds.length === 0) return new Map();
  const { data, error } = await supabase
    .from(PUBLIC_MEDIA_VIEW)
    .select('*')
    .in('property_id', propertyIds)
    .eq('is_cover', true);
  if (error) throw normalizeSupabaseError(error);
  const map = new Map<string, PublicMediaRow>();
  for (const row of (data ?? []) as PublicMediaRow[]) {
    if (!map.has(row.property_id)) map.set(row.property_id, row);
  }
  return map;
}

function sanitizeKeyword(keyword: string): string {
  return keyword.replace(/[%,()*\\]/g, ' ').trim();
}

export const propertyRepository = {
  async listPublished(filters: PropertySearchInput): Promise<PropertyListResult> {
    const from = (filters.page - 1) * filters.pageSize;
    const to = from + filters.pageSize - 1;

    let query = supabase.from(PUBLIC_PROPERTY_VIEW).select('*', { count: 'exact' });

    if (filters.listingType) query = query.eq('listing_type', filters.listingType);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.areaId) query = query.eq('area_id', filters.areaId);
    if (filters.county) query = query.eq('area_county', filters.county);
    if (filters.minPrice !== undefined) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
    if (filters.minBedrooms !== undefined) query = query.gte('bedrooms', filters.minBedrooms);
    if (filters.verifiedOnly) query = query.eq('verified', true);

    if (filters.keyword) {
      const kw = sanitizeKeyword(filters.keyword);
      if (kw) {
        query = query.or(`title.ilike.%${kw}%,description.ilike.%${kw}%,area_name.ilike.%${kw}%`);
      }
    }

    if (filters.sort === 'price_asc') {
      query = query.order('price', { ascending: true, nullsFirst: false });
    } else if (filters.sort === 'price_desc') {
      query = query.order('price', { ascending: false, nullsFirst: false });
    } else {
      query = query
        .order('featured', { ascending: false })
        .order('published_at', { ascending: false });
    }

    const { data, error, count } = await query.range(from, to);
    if (error) throw normalizeSupabaseError(error);

    const rows = (data ?? []) as PublicPropertyRow[];
    const covers = await coversFor(rows.map((r) => r.id));

    return {
      items: rows.map((r) => mapSummary(r, covers.get(r.id))),
      total: count ?? 0,
      page: filters.page,
      pageSize: filters.pageSize,
    };
  },

  async getBySlug(slug: string): Promise<PropertyDetail | null> {
    const { data, error } = await supabase
      .from(PUBLIC_PROPERTY_VIEW)
      .select('*')
      .eq('slug', slug)
      .maybeSingle();
    if (error) throw normalizeSupabaseError(error);
    if (!data) return null;

    const media = await propertyRepository.listMedia((data as PublicPropertyRow).id);
    return mapDetail(data as PublicPropertyRow, media as unknown as PublicMediaRow[]);
  },

  async getFeatured(limit: number): Promise<PropertySummary[]> {
    const { data, error } = await supabase
      .from(PUBLIC_PROPERTY_VIEW)
      .select('*')
      .eq('featured', true)
      .order('published_at', { ascending: false })
      .limit(limit);
    if (error) throw normalizeSupabaseError(error);

    const rows = (data ?? []) as PublicPropertyRow[];
    const covers = await coversFor(rows.map((r) => r.id));
    return rows.map((r) => mapSummary(r, covers.get(r.id)));
  },

  async listMedia(propertyId: string): Promise<PropertyMedia[]> {
    const { data, error } = await supabase
      .from(PUBLIC_MEDIA_VIEW)
      .select('*')
      .eq('property_id', propertyId)
      .order('sort_order', { ascending: true });
    if (error) throw normalizeSupabaseError(error);
    return ((data ?? []) as PublicMediaRow[]).map(mapMedia);
  },

  // ─── staff — base tables (Phase 6) ─────────────────────────────────────
  async listForStaff(filters: StaffPropertyFilters): Promise<StaffPropertyListResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 20;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('properties')
      .select('*, areas(name), property_media(count)', { count: 'exact' });

    if (filters.status) query = query.eq('status', filters.status);
    if (filters.listingType) query = query.eq('listing_type', filters.listingType);
    if (filters.propertyType) query = query.eq('property_type', filters.propertyType);
    if (filters.agentId) query = query.eq('agent_id', filters.agentId);
    if (filters.search) {
      const kw = filters.search.replace(/[%,()*\\]/g, ' ').trim();
      if (kw) query = query.or(`title.ilike.%${kw}%,reference_code.ilike.%${kw}%`);
    }

    const { data, error, count } = await query
      .order('updated_at', { ascending: false })
      .range(from, to);
    if (error) throw normalizeSupabaseError(error);

    return {
      items: ((data ?? []) as StaffPropertyJoinRow[]).map(mapStaffListItem),
      total: count ?? 0,
      page,
      pageSize,
    };
  },

  async getForStaff(id: string): Promise<StaffPropertyDetail | null> {
    const { data, error } = await supabase
      .from('properties')
      .select('*, areas(name), property_media(*)')
      .eq('id', id)
      .maybeSingle();
    if (error) throw normalizeSupabaseError(error);
    if (!data) return null;
    return mapStaffDetail(data);
  },

  async slugExists(slug: string, exceptId?: string): Promise<boolean> {
    let query = supabase.from('properties').select('id').eq('slug', slug).limit(1);
    if (exceptId) query = query.neq('id', exceptId);
    const { data, error } = await query;
    if (error) throw normalizeSupabaseError(error);
    return (data ?? []).length > 0;
  },

  async create(input: PropertyFormValues, meta: PropertyWriteMeta): Promise<string> {
    const row = {
      ...toPropertyRow(input),
      reference_code: '', // trigger fills KP-#### when blank
      created_by: meta.createdBy ?? null,
      agent_id: input.agentId ?? meta.defaultAgentId ?? null,
    };
    const { data, error } = await supabase.from('properties').insert(row).select('id').single();
    if (error) throw normalizeSupabaseError(error);
    return data.id;
  },

  async update(id: string, input: PropertyFormValues, meta: PropertyUpdateMeta): Promise<void> {
    const row = toPropertyRow(input);
    const patch = meta.canAssignAgent ? { ...row, agent_id: input.agentId ?? null } : row;
    const { error } = await supabase.from('properties').update(patch).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async setStatus(id: string, status: PropertyStatus): Promise<void> {
    // `published_at` is stamped by a DB trigger on the first publish transition.
    const { error } = await supabase.from('properties').update({ status }).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async setFeatured(id: string, featured: boolean): Promise<void> {
    const { error } = await supabase.from('properties').update({ featured }).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async setVerified(id: string, verified: boolean): Promise<void> {
    const { error } = await supabase.from('properties').update({ verified }).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },
};

// ─── staff mapping helpers ──────────────────────────────────────────────

export interface StaffPropertyFilters {
  status?: PropertyStatus;
  listingType?: ListingType;
  propertyType?: PropertyType;
  agentId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface PropertyWriteMeta {
  createdBy: string | null;
  /** Used when the form leaves the agent unset (e.g. an agent creating). */
  defaultAgentId: string | null;
}

export interface PropertyUpdateMeta {
  canAssignAgent: boolean;
}

interface PropertyBaseRow {
  id: string;
  title: string;
  slug: string;
  reference_code: string;
  status: string;
  listing_type: string;
  price_period: string | null;
  property_type: string;
  price: number | null;
  currency: string;
  area_id: string | null;
  bedrooms: number | null;
  bathrooms: number | null;
  featured: boolean;
  verified: boolean;
  agent_id: string | null;
  updated_at: string;
  address_line: string | null;
  latitude: number | null;
  longitude: number | null;
  owner_name: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  size_value: number | null;
  size_unit: string | null;
  description: string;
  amenities: unknown;
  available_from: string | null;
  created_by: string | null;
  published_at: string | null;
  created_at: string;
}

type StaffPropertyJoinRow = PropertyBaseRow & {
  areas: { name: string } | null;
  property_media: { count: number }[];
};

type StaffPropertyDetailJoinRow = PropertyBaseRow & {
  areas: { name: string } | null;
  property_media: PublicMediaRow[];
};

function mapStaffListItem(row: StaffPropertyJoinRow): StaffPropertyListItem {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    referenceCode: row.reference_code,
    status: row.status as PropertyStatus,
    listingType: row.listing_type as ListingType,
    propertyType: row.property_type as PropertyType,
    price: row.price,
    currency: row.currency,
    pricePeriod: (row.price_period as PricePeriod | null) ?? null,
    areaId: row.area_id,
    areaName: row.areas?.name ?? null,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    featured: row.featured,
    verified: row.verified,
    agentId: row.agent_id,
    mediaCount: row.property_media[0]?.count ?? 0,
    updatedAt: row.updated_at,
  };
}

function mapStaffDetail(row: StaffPropertyDetailJoinRow): StaffPropertyDetail {
  const media = [...row.property_media].sort((a, b) => a.sort_order - b.sort_order).map(mapMedia);
  return {
    ...mapStaffListItem({ ...row, property_media: [{ count: media.length }] }),
    addressLine: row.address_line,
    latitude: row.latitude,
    longitude: row.longitude,
    ownerName: row.owner_name,
    ownerPhone: row.owner_phone,
    ownerEmail: row.owner_email,
    sizeValue: row.size_value,
    sizeUnit: row.size_unit,
    description: row.description,
    amenities: toStringArray(row.amenities),
    availableFrom: row.available_from,
    createdBy: row.created_by,
    publishedAt: row.published_at,
    createdAt: row.created_at,
    media,
  };
}

/** Camel form values → snake_case DB row (shared by create + update). */
function toPropertyRow(input: PropertyFormValues) {
  return {
    title: input.title,
    slug: input.slug,
    listing_type: input.listingType,
    price_period: input.pricePeriod,
    property_type: input.propertyType,
    status: input.status,
    price: input.priceOnRequest ? null : input.price,
    currency: 'KES' as const,
    area_id: input.areaId,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    size_value: input.sizeValue,
    size_unit: input.sizeUnit,
    description: input.description,
    amenities: input.amenities,
    available_from: input.availableFrom || null,
    address_line: input.addressLine || null,
    latitude: input.latitude,
    longitude: input.longitude,
    owner_name: input.ownerName || null,
    owner_phone: input.ownerPhone || null,
    owner_email: input.ownerEmail || null,
    featured: input.featured,
    verified: input.verified,
  };
}
