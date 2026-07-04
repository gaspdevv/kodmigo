import type { ReactNode } from "react";

type LegalListProps = {
  items: ReactNode[];
};

export default function LegalList({ items }: LegalListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-kodmigo-orange"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
