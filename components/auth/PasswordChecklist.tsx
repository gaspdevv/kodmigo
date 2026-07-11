import { getPasswordRequirements } from "@/lib/auth/validation";

type PasswordChecklistProps = {
  password: string;
  confirmPassword: string;
};

export default function PasswordChecklist({
  password,
  confirmPassword,
}: PasswordChecklistProps) {
  const requirements = getPasswordRequirements(password, confirmPassword);

  if (!password && !confirmPassword) {
    return null;
  }

  return (
    <ul className="space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
      {requirements.map((requirement) => (
        <li
          key={requirement.key}
          className={`flex items-center gap-2 text-xs ${
            requirement.met ? "text-emerald-700" : "text-slate-500"
          }`}
        >
          <span
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
              requirement.met
                ? "bg-emerald-100 text-emerald-700"
                : "bg-slate-200 text-slate-400"
            }`}
            aria-hidden
          >
            {requirement.met ? "✓" : "·"}
          </span>
          {requirement.label}
        </li>
      ))}
    </ul>
  );
}
