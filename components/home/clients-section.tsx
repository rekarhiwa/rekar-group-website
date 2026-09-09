import Image from "next/image";

import { SectionHeading } from "@/components/public/section-heading";
import type { Client } from "@/types/database";

export function ClientsSection({
  title,
  subtitle,
  clients,
}: {
  title: string;
  subtitle?: string | null;
  clients: Client[];
}) {
  if (!clients.length) return null;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <SectionHeading eyebrow="Clients" title={title} subtitle={subtitle} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {clients.map((client) => (
            <div
              key={client.id}
              className="glass flex min-h-32 items-center justify-center rounded-[2rem] p-6 text-center"
            >
              {client.logo ? (
                <div className="relative h-14 w-full">
                  <Image
                    src={client.logo}
                    alt={client.name}
                    fill
                    className="object-contain"
                    sizes="160px"
                  />
                </div>
              ) : (
                <span className="text-lg font-semibold text-foreground">{client.name}</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
