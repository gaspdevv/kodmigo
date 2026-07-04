import type { ReactNode } from "react";

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export default function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className="rounded-3xl border border-kodmigo-orange/15 bg-white p-6 shadow-sm shadow-kodmigo-orange/5 sm:p-7">
      <h2 className="mb-3 text-xl font-bold text-kodmigo-navy">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-slate-600 sm:text-base">
        {children}
      </div>
    </section>
  );
}
