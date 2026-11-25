import { useState, type ReactNode, type FormEvent } from 'react';
import emailjs from '@emailjs/browser';
import type { Translation, Lang } from '../types';
import { contactMessage } from '../api';

const inputClass =
  'w-full px-4 py-3.5 rounded-xl border border-gray-200 text-gray-800 text-sm bg-gray-50 placeholder:text-gray-400 transition-colors';

const COPY: Record<
  Lang,
  {
    emailLabel: string;
    phoneLabel: string;
    sending: string;
    error: string;
    successTitle: string;
    successBody: string;
  }
> = {
  fr: {
    emailLabel: 'Email',
    phoneLabel: 'Téléphone',
    sending: 'Envoi en cours…',
    error: 'Impossible d’envoyer le message. Réessayez.',
    successTitle: 'Message envoyé !',
    successBody: 'Nous vous répondrons dans les plus brefs délais.',
  },
  ar: {
    emailLabel: 'البريد',
    phoneLabel: 'الهاتف',
    sending: 'جاري الإرسال…',
    error: 'تعذر إرسال الرسالة. حاول مرة أخرى.',
    successTitle: 'تم الإرسال!',
    successBody: 'سنتواصل معك قريبًا.',
  },
  en: {
    emailLabel: 'Email',
    phoneLabel: 'Phone',
    sending: 'Sending…',
    error: 'Could not send your message. Please try again.',
    successTitle: 'Message sent!',
    successBody: 'We will get back to you as soon as possible.',
  },
};

function SectionHeading({
  small,
  large,
  accent,
  center = true,
}: {
  small: string;
  large: string;
  accent?: string;
  center?: boolean;
}) {
  return (
    <div className={`mb-8 ${center ? 'text-center' : ''}`}>
      <span className="inline-block px-4 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
        {small}
      </span>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
        {large} {accent && <span className="gradient-text">{accent}</span>}
      </h2>
    </div>
  );
}

function MailIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function ContactCard({
  icon,
  label,
  value,
  href,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all group"
    >
      <div className="w-11 h-11 rounded-xl btn-gradient flex items-center justify-center text-white shadow flex-shrink-0 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</div>
        <div className="text-gray-800 font-semibold truncate">{value}</div>
      </div>
    </a>
  );
}

export default function ContactSection({ t, lang }: { t: Translation; lang: Lang }) {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const copy = COPY[lang];
  const phoneHref = `tel:${t.contact.phone.replace(/\s/g, '')}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    try {
      await contactMessage(formData);
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-24 bg-gradient-to-br from-gray-50 to-purple-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
          <div>
            <SectionHeading
              small={t.contact.headingSmall}
              large={t.contact.headingLarge}
              accent={t.contact.headingAccent}
              center={false}
            />
            <p className="text-gray-500 text-base mb-8 leading-relaxed -mt-4">{t.contact.description}</p>

            <div className="space-y-3">
              <ContactCard
                icon={<MailIcon />}
                label={copy.emailLabel}
                value={t.contact.email}
                href={`mailto:${t.contact.email}`}
              />
              <ContactCard
                icon={<PhoneIcon />}
                label={copy.phoneLabel}
                value={t.contact.phone}
                href={phoneHref}
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl border border-gray-100/80">
            {sent ? (
              <div className="text-center py-12 animate-fade-in-up">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center text-3xl">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{copy.successTitle}</h3>
                <p className="text-gray-500 text-sm">{copy.successBody}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.contact.namePlaceholder}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    required
                    autoComplete="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t.contact.namePlaceholder}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.contact.emailPlaceholder}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.contact.emailPlaceholder}
                    className={inputClass}
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-700 mb-2">
                    {t.contact.messagePlaceholder.replace('...', '')}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    minLength={10}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={t.contact.messagePlaceholder}
                    className={`${inputClass} resize-none min-h-[140px]`}
                    disabled={loading}
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-3" role="alert">
                    {copy.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gradient w-full text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <SendIcon />
                  {loading ? copy.sending : t.contact.button}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
