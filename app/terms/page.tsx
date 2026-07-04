import type { Metadata } from "next";
import LegalList from "@/components/legal/LegalList";
import LegalMailLink from "@/components/legal/LegalMailLink";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Kullanım Şartları | Kodmigo",
  description: "Kodmigo kullanım şartları ve temel kurallar.",
};

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Kullanım Şartları"
      description="Kodmigo’yu kullanırken geçerli olan temel kuralları burada bulabilirsin."
      lastUpdated="Temmuz 2026"
    >
      <LegalSection title="Kodmigo nedir?">
        <LegalList
          items={[
            "Kodmigo, Python öğrenmeyi kolaylaştırmak için hazırlanmış bir eğitim uygulamasıdır.",
            "Dersler, XP, rozetler ve Migo’nun ipuçlarıyla öğrenmeyi daha eğlenceli hale getirir.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Hesap kullanımı">
        <LegalList
          items={[
            "Doğru ve erişebildiğin bir e-posta adresi kullanmalısın.",
            "Hesabının güvenliğinden sen sorumlusun.",
            "Şifreni başkalarıyla paylaşmamalısın.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Uygun kullanım">
        <LegalList
          items={[
            "Uygulamayı kötüye kullanmamalısın.",
            "Bot veya spam amaçlı kullanım yasaktır.",
            "Sistemi zorlayan ya da güvenliği aşmaya çalışan davranışlar yasaktır.",
            "Başka kullanıcıların verilerine erişmeye çalışmak yasaktır.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Eğitim içeriği">
        <LegalList
          items={[
            "Kodmigo, öğrenmene yardımcı olmak için hazırlanmıştır.",
            "İçerikler zamanla güncellenebilir.",
            "Hatalı veya eksik gördüğün içerikleri bize bildirebilirsin.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Hizmetin değişmesi">
        <LegalList
          items={[
            "Kodmigo zamanla yeni özellikler ekleyebilir veya bazı özellikleri değiştirebilir.",
            "MVP/test sürecinde küçük hatalar veya değişiklikler olabilir.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Sorumluluk sınırı">
        <LegalList
          items={[
            "Kodmigo eğitim amaçlıdır.",
            "Uygulamanın kesintisiz veya hatasız çalışacağı garanti edilmez.",
            "Kullanıcı deneyimini iyileştirmek için düzenli olarak geliştirme yapılır.",
          ]}
        />
      </LegalSection>

      <LegalSection title="İletişim">
        <p>
          Kullanım şartlarıyla ilgili soruların için bize şu adresten
          ulaşabilirsin: <LegalMailLink />
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
