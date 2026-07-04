const SUPPORT_EMAIL = "destek@kodmigo.com";

export default function LegalMailLink() {
  return (
    <a
      href={`mailto:${SUPPORT_EMAIL}`}
      className="font-semibold text-kodmigo-orange underline-offset-2 hover:underline"
    >
      {SUPPORT_EMAIL}
    </a>
  );
}
