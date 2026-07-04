import type { Metadata } from "next";
import LegalDefinitionList from "@/components/legal/LegalDefinitionList";
import LegalList from "@/components/legal/LegalList";
import LegalMailLink from "@/components/legal/LegalMailLink";
import LegalPageLayout from "@/components/legal/LegalPageLayout";
import LegalSection from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | Kodmigo",
  description:
    "Kodmigo’nun gizlilik politikası ve veri kullanımı hakkında bilgi.",
};

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Gizlilik Politikası"
      description="Kodmigo’da hangi bilgileri neden kullandığımızı sade bir şekilde anlattık."
      lastUpdated="Temmuz 2026"
    >
      <LegalSection title="Topladığımız bilgiler">
        <p>
          Kodmigo’yu kullanırken yalnızca öğrenme deneyimini oluşturmak için
          gereken bilgileri saklıyoruz:
        </p>
        <LegalList
          items={[
            "E-posta adresin",
            "Kullanıcı adın",
            "Profil ve avatar tercihin",
            "Onboarding (başlangıç) sorularına verdiğin cevaplar",
            "Ders ilerlemen",
            "XP (deneyim puanı) bilgin",
            "Seri (streak) bilgin",
            "Rozet ve aşama bilgilerin",
            "Oturum ve güvenlikle ilgili teknik bilgiler",
          ]}
        />
      </LegalSection>

      <LegalSection title="Bu bilgileri neden kullanıyoruz?">
        <p>Topladığımız bilgileri şu amaçlarla kullanıyoruz:</p>
        <LegalList
          items={[
            "Hesabını oluşturmak ve giriş yapmanı sağlamak",
            "E-posta doğrulaması göndermek",
            "Ders ilerlemeni kaydetmek",
            "Python öğrenme yolunu seviyene göre kişiselleştirmek",
            "XP, rozet, seri ve profil bilgilerini sana göstermek",
            "Hesabının güvenliğini korumak",
            "Bot ve kötüye kullanım riskini azaltmak",
          ]}
        />
      </LegalSection>

      <LegalSection title="Üçüncü taraf servisler">
        <p>
          Kodmigo’yu çalıştırmak için güvendiğimiz birkaç servisten
          yararlanıyoruz:
        </p>
        <LegalDefinitionList
          items={[
            {
              term: "Supabase",
              description: "Kimlik doğrulama ve kullanıcı verilerinin saklanması",
            },
            {
              term: "Resend",
              description: "Doğrulama e-postalarının gönderilmesi",
            },
            {
              term: "hCaptcha",
              description: "Bot ve kötüye kullanıma karşı koruma",
            },
            {
              term: "Vercel",
              description: "Uygulamanın yayınlanması ve barındırılması",
            },
          ]}
        />
      </LegalSection>

      <LegalSection title="Neleri yapmıyoruz?">
        <LegalList
          items={[
            "Verilerini satmıyoruz.",
            "Verilerini reklam amacıyla paylaşmıyoruz.",
            "Gereksiz veya hassas bilgi istemiyoruz.",
            "Şu an ödeme bilgisi toplamıyoruz.",
            "Şu an reklam veya üçüncü taraf analitik kullanmıyoruz.",
          ]}
        />
      </LegalSection>

      <LegalSection title="Verilerini nasıl koruyoruz?">
        <p>Verilerini korumak için şu yöntemleri kullanıyoruz:</p>
        <LegalList
          items={[
            "Supabase Row Level Security (RLS)",
            "Kullanıcı bazlı veri izolasyonu",
            "Güvenli kimlik doğrulama (auth) akışı",
            "hCaptcha koruması",
            "Güvenlik başlıkları (security headers)",
            "Sadece gerekli verileri saklama prensibi",
          ]}
        />
      </LegalSection>

      <LegalSection title="Hesabın ve verilerin">
        <p>
          Hesabın veya verilerinle ilgili bir talebin olursa bizimle iletişime
          geçebilirsin. Örneğin hesabınla ilgili sorularını{" "}
          <LegalMailLink /> adresine iletebilirsin.
        </p>
      </LegalSection>

      <LegalSection title="İletişim">
        <p>
          Gizlilikle ilgili soruların için bize şu adresten ulaşabilirsin:{" "}
          <LegalMailLink />
        </p>
      </LegalSection>
    </LegalPageLayout>
  );
}
