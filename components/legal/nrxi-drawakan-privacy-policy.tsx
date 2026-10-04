"use client";

import { useState } from "react";

const SUPPORT_EMAIL = "rekarhiwa2001@gmail.com";
const PACKAGE_NAME = "nrxi.drawakan.app";
const UPDATED_KU = "٢٠٢٦-٠٩-١٦";
const UPDATED_EN = "2026-09-16";

export function PrivacyPolicyContent() {
  const [lang, setLang] = useState<"ku" | "en">("ku");

  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLang("ku")}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            lang === "ku"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-soft text-foreground"
          }`}
        >
          کوردی
        </button>
        <button
          type="button"
          onClick={() => setLang("en")}
          className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition ${
            lang === "en"
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-soft text-foreground"
          }`}
        >
          English
        </button>
      </div>

      {lang === "ku" ? (
        <div className="space-y-4 text-right" dir="rtl" lang="ckb">
          <header className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.25em] text-light-violet uppercase">
              Rekar Group · نرخی دراوەکان
            </p>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              سیاسەتی پاراستنی زانیاری
            </h1>
            <p className="text-sm text-muted">
              دوایین نوێکردنەوە: {UPDATED_KU} · Package:{" "}
              <code className="rounded bg-soft px-1.5 py-0.5 text-xs">{PACKAGE_NAME}</code>
            </p>
          </header>

          <Section title="١. کێین؟">
            <p>
              ئەپی «نرخی دراوەکان» (Android و iOS) لەلایەن{" "}
              <strong>ڕێکار گروپ (Rekar Group)</strong> پەرەی پێدراوە. ئەپەکە
              نرخی دراو، زێڕ و کریپتۆ پیشان دەدات بەپێی شار، لەگەڵ ئاگاداری
              ئارەزوومەندانە کاتێک نرخ دەگۆڕێت.
            </p>
          </Section>

          <Section title="٢. چ زانیارییەک کۆدەکەینەوە؟">
            <ul className="list-disc space-y-1 pr-5">
              <li>
                Token ی ئاگاداری (Expo / Google FCM / Apple APNs) — تەنها ئەگەر
                تۆ ڕێگە بدەیت بە Notification
              </li>
              <li>
                لیستی ئەو دراو / زێڕ / کریپتۆیانەی کە دەتەوێت ئاگاداریت بۆ
                بنێردرێت
              </li>
              <li>
                شار و ڕێکخستنی ناوخۆیی لەسەر ئامێرەکەت (زمان، ڕووکار، هتد)
              </li>
              <li>
                زانیاری تەکنیکی سادە بۆ کارکردنی سێرڤەر (وەک کاتی تۆمارکردنی
                ئامێر)
              </li>
            </ul>
            <p className="mt-3">
              ئێمە ناوی تەواو، ژمارەی مۆبایل، ناونیشان، یان زانیاری بانکی داوا
              ناکەین بۆ بەکارهێنانی ئاساییی ئەپ. هەژماری بەکارهێنەر بۆ بەکارهێنەری
              ئاسایی پێویست نییە.
            </p>
          </Section>

          <Section title="٣. بۆچی کۆدەکەینەوە؟">
            <ul className="list-disc space-y-1 pr-5">
              <li>ناردنی ئاگاداری گۆڕانی نرخ</li>
              <li>پیشاندانی نرخ بەپێی شار و ڕێکخستنەکانت</li>
              <li>جێگیری و کارکردنی خزمەتگوزاری</li>
            </ul>
          </Section>

          <Section title="٤. لایەنی سێیەم">
            <ul className="list-disc space-y-1 pr-5">
              <li>
                Google Firebase Cloud Messaging / Apple Push / Expo — گەیاندنی
                ئاگاداری
              </li>
              <li>سێرڤەری API ی خۆمان — تۆمارکردنی ئامێر و ناردنی ئاگاداری</li>
              <li>InstantDB — هەندێک ڕێکخستنی ئەپ (وەک لینکی سۆشیال)</li>
              <li>
                CoinGecko — نرخی کریپتۆ (داواکاری گشتی، بێ هەژماری کەسی)
              </li>
            </ul>
            <p className="mt-3">
              ئێمە زانیاری نابفرۆشین و بۆ ڕیکلامی شوێنپێهەڵگرتن (tracking ads)
              بەکارناهێنین.
            </p>
          </Section>

          <Section title="٥. مافەکانی تۆ">
            <p>
              دەتوانیت ئاگاداری لە ناو ئەپ یان لە ڕێکخستنی سیستەمی ئامێرەکەت
              بکوژیتەوە. بۆ داواکردنی سڕینەوەی token یان زانیاری پەیوەندیدار،
              پەیوەندی بکە بە:
            </p>
            <p className="mt-2">
              <a
                className="font-semibold text-light-violet underline-offset-4 hover:underline"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </Section>

          <Section title="٦. منداڵان">
            <p>
              ئەپەکە بۆ منداڵانی ژێر ١٣ بەتایبەتی دروست نەکراوە. ئێمە بە ئەنقەست
              زانیاری کەسی لە منداڵان کۆناکەینەوە.
            </p>
          </Section>

          <Section title="٧. گۆڕانکاری">
            <p>
              لەوانەیە ئەم سیاسەتە نوێ بکەینەوە. بەرواری «دوایین نوێکردنەوە» لە
              سەرەوە دەگۆڕدرێت. بەردەوامبوون لە بەکارهێنانی ئەپ واتای وەرگرتنی
              وەشانی نوێیە.
            </p>
          </Section>

          <Section title="٨. پەیوەندی">
            <p>
              پشتگیری و پرسیار:{" "}
              <a
                className="font-semibold text-light-violet underline-offset-4 hover:underline"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="mt-2 text-sm text-muted">
              وێبسایت:{" "}
              <a
                className="underline-offset-4 hover:underline"
                href="https://www.rekar.group"
              >
                www.rekar.group
              </a>
            </p>
          </Section>
        </div>
      ) : (
        <div className="space-y-4 text-left" dir="ltr" lang="en">
          <header className="space-y-2">
            <p className="text-xs font-semibold tracking-[0.25em] text-light-violet uppercase">
              Rekar Group · Nirkhi Drawakan
            </p>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="text-sm text-muted">
              Last updated: {UPDATED_EN} · Package:{" "}
              <code className="rounded bg-soft px-1.5 py-0.5 text-xs">{PACKAGE_NAME}</code>
            </p>
          </header>

          <Section title="1. Who we are">
            <p>
              «Nirkhi Drawakan» (Android &amp; iOS) is developed by{" "}
              <strong>Rekar Group</strong>. The app shows currency, gold, and
              crypto market rates by city, with optional push alerts when prices
              change.
            </p>
          </Section>

          <Section title="2. What we collect">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Push notification tokens (Expo / Google FCM / Apple APNs) —
                only if you grant permission
              </li>
              <li>
                The list of currencies / gold / crypto you choose for alerts
              </li>
              <li>
                Local preferences on your device (city, language, theme, etc.)
              </li>
              <li>
                Basic technical data needed to operate the service (e.g. device
                registration time)
              </li>
            </ul>
            <p className="mt-3">
              We do not ask for your full name, phone number, address, or banking
              details for normal app use. No user account is required for regular
              use.
            </p>
          </Section>

          <Section title="3. Why we collect it">
            <ul className="list-disc space-y-1 pl-5">
              <li>To send price-change notifications</li>
              <li>To show rates according to your city and preferences</li>
              <li>To keep the service reliable</li>
            </ul>
          </Section>

          <Section title="4. Third parties">
            <ul className="list-disc space-y-1 pl-5">
              <li>
                Google Firebase Cloud Messaging / Apple Push / Expo — delivery
                of notifications
              </li>
              <li>Our own API server — device registration and alerts</li>
              <li>InstantDB — some app configuration (e.g. social links)</li>
              <li>
                CoinGecko — crypto prices (public API requests; no personal
                account)
              </li>
            </ul>
            <p className="mt-3">
              We do not sell your data and we do not use it for advertising
              tracking.
            </p>
          </Section>

          <Section title="5. Your rights">
            <p>
              You can turn off notifications in the app or in your device
              settings. To request deletion of your push token or related data,
              contact:
            </p>
            <p className="mt-2">
              <a
                className="font-semibold text-light-violet underline-offset-4 hover:underline"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
          </Section>

          <Section title="6. Children">
            <p>
              The app is not directed at children under 13. We do not knowingly
              collect personal information from children.
            </p>
          </Section>

          <Section title="7. Changes">
            <p>
              We may update this policy. The “Last updated” date above will
              change. Continued use of the app means you accept the updated
              version.
            </p>
          </Section>

          <Section title="8. Contact">
            <p>
              Support:{" "}
              <a
                className="font-semibold text-light-violet underline-offset-4 hover:underline"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>
            </p>
            <p className="mt-2 text-sm text-muted">
              Website:{" "}
              <a
                className="underline-offset-4 hover:underline"
                href="https://www.rekar.group"
              >
                www.rekar.group
              </a>
            </p>
          </Section>
        </div>
      )}
    </article>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-soft/60 p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-bold text-foreground">{title}</h2>
      <div className="space-y-2 text-[15px] leading-8 text-muted">{children}</div>
    </section>
  );
}
