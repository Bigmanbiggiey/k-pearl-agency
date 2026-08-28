import { AppError, normalizeSupabaseError } from '@/lib/errors';
import { propertyImageUrl } from '@/lib/media';
import { supabase } from '@/lib/supabase';
import type { PropertyMedia } from '@/types';

/**
 * Staff media management for a property. Files live in the `property-media`
 * Storage bucket under `properties/{propertyId}/{uuid}.{ext}` (docs/database.md).
 * RLS lets an agent write only where the parent property is theirs; admin any.
 */

const BUCKET = 'property-media';
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
const MAX_BYTES = 8 * 1024 * 1024;

interface MediaRow {
  id: string;
  property_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  is_cover: boolean;
}

function map(row: MediaRow): PropertyMedia {
  return {
    id: row.id,
    propertyId: row.property_id,
    storagePath: row.storage_path,
    altText: row.alt_text,
    sortOrder: row.sort_order,
    isCover: row.is_cover,
  };
}

function extensionFor(file: File): string {
  const fromName = file.name.includes('.') ? file.name.split('.').pop() : undefined;
  const ext = (fromName ?? file.type.split('/').pop() ?? 'jpg').toLowerCase();
  return ext === 'jpeg' ? 'jpg' : ext;
}

export const propertyMediaRepository = {
  publicUrl(storagePath: string): string {
    return propertyImageUrl(storagePath);
  },

  async list(propertyId: string): Promise<PropertyMedia[]> {
    const { data, error } = await supabase
      .from('property_media')
      .select('*')
      .eq('property_id', propertyId)
      .order('sort_order', { ascending: true });
    if (error) throw normalizeSupabaseError(error);
    return ((data ?? []) as MediaRow[]).map(map);
  },

  async upload(propertyId: string, file: File, altText: string): Promise<PropertyMedia> {
    if (!ALLOWED_MIME.includes(file.type)) {
      throw new AppError('VALIDATION_ERROR', 'Use a JPEG, PNG, WebP or AVIF image.');
    }
    if (file.size > MAX_BYTES) {
      throw new AppError('VALIDATION_ERROR', 'Images must be 8 MB or smaller.');
    }

    const existing = await propertyMediaRepository.list(propertyId);
    const path = `properties/${propertyId}/${crypto.randomUUID()}.${extensionFor(file)}`;

    const { error: uploadError } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { contentType: file.type, upsert: false });
    if (uploadError) throw new AppError('STORAGE_ERROR', 'The image could not be uploaded.');

    const nextOrder = existing.reduce((max, m) => Math.max(max, m.sortOrder), -1) + 1;
    const { data, error } = await supabase
      .from('property_media')
      .insert({
        property_id: propertyId,
        storage_path: path,
        alt_text: altText.trim(),
        sort_order: nextOrder,
        is_cover: existing.length === 0,
      })
      .select('*')
      .single();
    if (error) {
      await supabase.storage.from(BUCKET).remove([path]);
      throw normalizeSupabaseError(error);
    }
    return map(data);
  },

  async update(id: string, patch: { altText?: string; isCover?: boolean }): Promise<void> {
    if (patch.isCover === true) {
      const { data: current, error: readError } = await supabase
        .from('property_media')
        .select('property_id')
        .eq('id', id)
        .single();
      if (readError) throw normalizeSupabaseError(readError);
      const { error: clearError } = await supabase
        .from('property_media')
        .update({ is_cover: false })
        .eq('property_id', current.property_id);
      if (clearError) throw normalizeSupabaseError(clearError);
    }

    const row: { alt_text?: string; is_cover?: boolean } = {};
    if (patch.altText !== undefined) row.alt_text = patch.altText.trim();
    if (patch.isCover !== undefined) row.is_cover = patch.isCover;
    const { error } = await supabase.from('property_media').update(row).eq('id', id);
    if (error) throw normalizeSupabaseError(error);
  },

  async remove(id: string): Promise<void> {
    const { data, error: readError } = await supabase
      .from('property_media')
      .select('property_id, storage_path, is_cover')
      .eq('id', id)
      .single();
    if (readError) throw normalizeSupabaseError(readError);
    const removed = data;

    const { error } = await supabase.from('property_media').delete().eq('id', id);
    if (error) throw normalizeSupabaseError(error);
    await supabase.storage.from(BUCKET).remove([removed.storage_path]);

    if (removed.is_cover) {
      const rest = await propertyMediaRepository.list(removed.property_id);
      const next = rest[0];
      if (next) await propertyMediaRepository.update(next.id, { isCover: true });
    }
  },

  async reorder(propertyId: string, orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i += 1) {
      const id = orderedIds[i];
      if (!id) continue;
      const { error } = await supabase
        .from('property_media')
        .update({ sort_order: i })
        .eq('id', id)
        .eq('property_id', propertyId);
      if (error) throw normalizeSupabaseError(error);
    }
  },
};
