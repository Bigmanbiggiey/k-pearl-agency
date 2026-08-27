import { normalizeSupabaseError, notImplemented } from '@/lib/errors';
import { supabase } from '@/lib/supabase';
import type { PropertySearchInput } from '@/schemas';
import type {
  ListingType,
  PricePeriod,
  PropertyDetail,
  PropertyListResult,
  PropertyMedia,
  PropertySummary,
  PropertyType,
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

  // ─── write / lifecycle — Phase 6 ────────────────────────────────────────
  create(_input: unknown): Promise<never> {
    return notImplemented('propertyRepository.create');
  },
  update(_id: string, _input: unknown): Promise<never> {
    return notImplemented('propertyRepository.update');
  },
  publish(_id: string): Promise<never> {
    return notImplemented('propertyRepository.publish');
  },
  unpublish(_id: string): Promise<never> {
    return notImplemented('propertyRepository.unpublish');
  },
  markUnavailable(_id: string): Promise<never> {
    return notImplemented('propertyRepository.markUnavailable');
  },
  markLetOrSold(_id: string): Promise<never> {
    return notImplemented('propertyRepository.markLetOrSold');
  },
  archive(_id: string): Promise<never> {
    return notImplemented('propertyRepository.archive');
  },
  setFeatured(_id: string, _featured: boolean): Promise<never> {
    return notImplemented('propertyRepository.setFeatured');
  },
  setVerified(_id: string, _verified: boolean): Promise<never> {
    return notImplemented('propertyRepository.setVerified');
  },
  addMedia(_input: unknown): Promise<never> {
    return notImplemented('propertyRepository.addMedia');
  },
  removeMedia(_id: string): Promise<never> {
    return notImplemented('propertyRepository.removeMedia');
  },
  reorderMedia(_propertyId: string, _orderedIds: string[]): Promise<never> {
    return notImplemented('propertyRepository.reorderMedia');
  },
};
