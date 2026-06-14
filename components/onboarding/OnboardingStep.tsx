type OnboardingStepProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export default function OnboardingStep({
  title,
  description,
  children,
}: OnboardingStepProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-kodmigo-navy sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-base leading-relaxed text-slate-600">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
