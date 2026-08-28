import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { emptyToUndefined } from './coerce';
import { ConsentField } from './ConsentField';
import { Honeypot } from './Honeypot';
import { LeadFormSuccess } from './LeadFormSuccess';
import { useLeadSubmit } from './useLeadSubmit';

import { FormField, SelectInput, TextArea, TextInput } from '@/components/ui';
import { useCreateViewingRequest } from '@/hooks';
import { viewingRequestSchema, type ViewingRequestInput } from '@/schemas';

interface Props {
  propertyId: string;
  reference?: string;
}

const today = new Date().toISOString().slice(0, 10);

export function ViewingRequestForm({ propertyId, reference }: Props) {
  const mutation = useCreateViewingRequest();
  const { status, errorMessage, run } = useLeadSubmit<ViewingRequestInput>((v) =>
    mutation.mutateAsync(v),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ViewingRequestInput>({
    resolver: zodResolver(viewingRequestSchema),
    defaultValues: { propertyId, name: '', phone: '', email: '', message: '', company: '' },
  });

  if (status === 'success') {
    return (
      <LeadFormSuccess title="Viewing request received.">
        We&rsquo;ll call or message you to arrange a time
        {reference ? ` for ${reference}` : ''}.
      </LeadFormSuccess>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(run)(e)} className="space-y-4" noValidate>
      <Honeypot field={register('company')} />
      <input type="hidden" {...register('propertyId')} />

      <FormField label="Your name" htmlFor="vr-name" required error={errors.name?.message}>
        <TextInput
          id="vr-name"
          autoComplete="name"
          aria-invalid={errors.name ? 'true' : undefined}
          {...register('name')}
        />
      </FormField>

      <FormField
        label="Phone number"
        htmlFor="vr-phone"
        required
        hint="Kenyan number, e.g. 0712 345678"
        error={errors.phone?.message}
      >
        <TextInput
          id="vr-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          aria-invalid={errors.phone ? 'true' : undefined}
          {...register('phone')}
        />
      </FormField>

      <FormField label="Email address (optional)" htmlFor="vr-email" error={errors.email?.message}>
        <TextInput id="vr-email" type="email" inputMode="email" {...register('email')} />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Preferred date" htmlFor="vr-date" error={errors.preferredDate?.message}>
          <TextInput
            id="vr-date"
            type="date"
            min={today}
            {...register('preferredDate', { setValueAs: emptyToUndefined })}
          />
        </FormField>
        <FormField label="Preferred time" htmlFor="vr-time" error={errors.preferredTime?.message}>
          <SelectInput
            id="vr-time"
            defaultValue=""
            {...register('preferredTime', { setValueAs: emptyToUndefined })}
          >
            <option value="">Any time</option>
            <option value="morning">Morning</option>
            <option value="afternoon">Afternoon</option>
            <option value="evening">Evening</option>
          </SelectInput>
        </FormField>
      </div>

      <FormField
        label="Anything else? (optional)"
        htmlFor="vr-message"
        error={errors.message?.message}
      >
        <TextArea id="vr-message" rows={3} {...register('message')} />
      </FormField>

      <ConsentField field={register('consent')} error={errors.consent?.message} />

      {status === 'error' ? (
        <p className="text-sm text-danger" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="rounded-sm bg-gold px-6 py-2.5 text-sm font-medium text-ink hover:bg-gold-deep disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Request viewing'}
      </button>
    </form>
  );
}
