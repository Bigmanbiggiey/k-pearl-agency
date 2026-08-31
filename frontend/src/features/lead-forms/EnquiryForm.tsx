import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { ConsentField } from './ConsentField';
import { Honeypot } from './Honeypot';
import { LeadFormSuccess } from './LeadFormSuccess';
import { useLeadSubmit } from './useLeadSubmit';

import { FormField, TextArea, TextInput } from '@/components/ui';
import { useCreateInquiry } from '@/hooks';
import { inquirySchema, type InquiryInput } from '@/schemas';

interface Props {
  type: 'property_enquiry' | 'general';
  propertyId?: string;
  reference?: string;
}

const CONTACT_METHODS = [
  { value: 'phone', label: 'Phone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'email', label: 'Email' },
] as const;

export function EnquiryForm({ type, propertyId, reference }: Props) {
  const mutation = useCreateInquiry();
  const { status, errorMessage, run } = useLeadSubmit<InquiryInput>((v) => mutation.mutateAsync(v));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryInput>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      type,
      ...(propertyId ? { propertyId } : {}),
      name: '',
      phone: '',
      email: '',
      message: '',
      preferredContactMethod: 'phone',
      company: '',
    },
  });

  if (status === 'success') {
    return (
      <LeadFormSuccess title="Thank you — your enquiry is in.">
        A member of the K Pearl team will be in touch shortly
        {reference ? ` about ${reference}` : ''}. If it&rsquo;s urgent, please call or WhatsApp us.
      </LeadFormSuccess>
    );
  }

  return (
    <form onSubmit={(e) => void handleSubmit(run)(e)} className="space-y-4" noValidate>
      <Honeypot field={register('company')} />
      <input type="hidden" {...register('type')} />
      {propertyId ? <input type="hidden" {...register('propertyId')} /> : null}

      <FormField label="Your name" htmlFor="enq-name" required error={errors.name?.message}>
        <TextInput
          id="enq-name"
          autoComplete="name"
          aria-invalid={errors.name ? 'true' : undefined}
          {...register('name')}
        />
      </FormField>

      <FormField
        label="Phone number"
        htmlFor="enq-phone"
        required
        hint="Kenyan number, e.g. 0712 345678"
        error={errors.phone?.message}
      >
        <TextInput
          id="enq-phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          aria-invalid={errors.phone ? 'true' : undefined}
          {...register('phone')}
        />
      </FormField>

      <FormField label="Email address (optional)" htmlFor="enq-email" error={errors.email?.message}>
        <TextInput
          id="enq-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          aria-invalid={errors.email ? 'true' : undefined}
          {...register('email')}
        />
      </FormField>

      <FormField label="Message" htmlFor="enq-message" required error={errors.message?.message}>
        <TextArea
          id="enq-message"
          aria-invalid={errors.message ? 'true' : undefined}
          {...register('message')}
        />
      </FormField>

      <fieldset>
        <legend className="mb-1 block text-sm font-medium text-charcoal">
          Preferred way to reach you
        </legend>
        <div className="flex flex-wrap gap-4 text-sm text-charcoal">
          {CONTACT_METHODS.map((m) => (
            <label key={m.value} className="flex items-center gap-1.5">
              <input
                type="radio"
                value={m.value}
                className="accent-gold"
                {...register('preferredContactMethod')}
              />
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>

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
        {status === 'submitting' ? 'Sending…' : 'Send enquiry'}
      </button>
    </form>
  );
}
