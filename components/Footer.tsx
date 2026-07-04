import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <p className="text-xl font-bold text-kodmigo-orange">Kodmigo</p>
        <p className="mt-1 text-sm text-kodmigo-navy">Her gün biraz kod.</p>

        <nav className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link
            href="/privacy"
            className="font-medium text-slate-500 transition hover:text-kodmigo-orange"
          >
            Gizlilik Politikası
          </Link>
          <Link
            href="/terms"
            className="font-medium text-slate-500 transition hover:text-kodmigo-orange"
          >
            Kullanım Şartları
          </Link>
        </nav>

        <p className="mt-4 text-xs text-slate-400">
          © 2026 Kodmigo. Tüm hakları saklıdır.
        </p>
      </div>
    </footer>
  );
}
