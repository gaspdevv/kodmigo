type LegalDefinitionItem = {
  term: string;
  description: string;
};

type LegalDefinitionListProps = {
  items: LegalDefinitionItem[];
};

export default function LegalDefinitionList({
  items,
}: LegalDefinitionListProps) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.term} className="flex gap-2.5">
          <span
            aria-hidden="true"
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-kodmigo-orange"
          />
          <span>
            <span className="font-semibold text-kodmigo-navy">
              {item.term}:
            </span>{" "}
            {item.description}
          </span>
        </li>
      ))}
    </ul>
  );
}
