import { ContactForm } from "@/app/(public)/contact/contact-form";
import { submitContactForm } from "@/app/(public)/contact/actions";
import { getSiteSettings } from "@/services/content";

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1 text-xs font-semibold tracking-[0.3em] text-light-violet uppercase">
            Contact
          </span>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">
            با قسە بکەین لەسەر پڕۆژەکەت
          </h1>
          <p className="text-lg leading-8 text-muted">
            پێمان بڵێ چی دروست دەکەیت و ئێمە ڕێگای گونجاو بۆ گەیشتن بە ئامانجەکەت دابنێین.
          </p>

          <div className="glass space-y-4 rounded-[2rem] p-6">
            {settings.phone ? <p className="text-sm text-muted">مۆبایل: {settings.phone}</p> : null}
            {settings.email ? <p className="text-sm text-muted">ئیمەیڵ: {settings.email}</p> : null}
            {settings.address ? <p className="text-sm text-muted">ناونیشان: {settings.address}</p> : null}
            {settings.whatsapp ? (
              <p className="text-sm text-muted">WhatsApp: {settings.whatsapp}</p>
            ) : null}
          </div>
        </div>

        <ContactForm action={submitContactForm} />
      </div>
    </section>
  );
}
