# İlk Kullanıcı Testi Rehberi

Bu rehber, Kodmigo'nun ilk gerçek kullanıcı testi için hazırlanmıştır.

**Canlı adres:** https://kodmigo.vercel.app

Test sırasında karşılaştığın sorunları, kafanın karıştığı anları ve ekran görüntülerini not alman yeterli. Her adımı tamamlamak zorunda değilsin; takıldığın yerde durup geri bildirim verebilirsin.

---

## Test öncesi

- Mümkünse hem masaüstü hem mobil tarayıcıda dene.
- Yeni bir e-posta adresi kullan (daha önce kayıt olmadığın bir adres).
- E-posta doğrulama açıksa gelen kutunu kontrol etmeyi unutma.

---

## Test akışı

Aşağıdaki adımları sırayla dene. Her adımın yanına kısa not düşebilirsin.

### 1. Landing page

- [ ] Ana sayfayı aç: https://kodmigo.vercel.app
- [ ] Sayfa düzgün yükleniyor mu?
- [ ] "Python yoluna başla" veya benzeri CTA net mi?

### 2. Onboarding

- [ ] Onboarding akışını başlat ve tamamla.
- [ ] Sorular anlaşılır mı?
- [ ] Son ekranda yol özeti mantıklı görünüyor mu?

### 3. Kayıt ol

- [ ] Kayıt sayfasına git (`/auth/sign-up`).
- [ ] Kullanıcı adı, e-posta ve şifre ile hesap oluştur.
- [ ] Hata mesajları (varsa) anlaşılır mı?

### 4. E-posta doğrulama

- [ ] Gelen kutunu kontrol et.
- [ ] Doğrulama bağlantısına tıkla.
- [ ] Yönlendirme düzgün çalışıyor mu?

### 5. Giriş yap

- [ ] Giriş sayfasından (`/auth/sign-in`) hesabınla giriş yap.
- [ ] Giriş sonrası doğru sayfaya yönlendiriliyor musun?

### 6. Ana Sayfa (Dashboard)

- [ ] Ana Sayfa'yı incele (`/dashboard`).
- [ ] Karşılama mesajı, XP/aşama kartı, günlük görev ve sıradaki ders kartları görünüyor mu?
- [ ] Yeni hesapta sayfa boş veya bozuk görünmüyor mu?

### 7. İlk dersi tamamla

- [ ] Python yolundan veya Ana Sayfa'dan ilk dersi aç.
- [ ] Ders adımlarını tamamla.
- [ ] XP, ilerleme ve seri güncelleniyor mu?

### 8. Kod yazma etkinliği

- [ ] `codeWriting` veya kod yazma gerektiren bir adımı dene.
- [ ] Doğru/yanlış geri bildirimi net mi?
- [ ] Soru adil hissettiriyor mu?

### 9. Migo'nun Tanışma Kartı mini projesi

- [ ] "Migo'nun Tanışma Kartı" dersini bul ve tamamla.
- [ ] Validation (doğrulama) düzgün çalışıyor mu?
- [ ] Tamamlayınca **25 XP** kazanıldığını kontrol et.

### 10. Profil sayfası

- [ ] Profil sayfasına git (`/profile`).
- [ ] Üst kartta avatar, kullanıcı adı ve aşama bilgisi görünüyor mu?

### 11. Avatar değiştir

- [ ] Profil fotoğrafına tıklayıp yeni bir görsel yükle.
- [ ] Yükleme başarılı mı? Hata mesajı (varsa) anlaşılır mı?

### 12. Kullanıcı adını değiştir

- [ ] Kullanıcı adını düzenle ve kaydet.
- [ ] Değişiklik hemen görünüyor mu?

### 13. Rozetleri kontrol et

- [ ] Profil üst kartında kazanılan rozet ikonları var mı?
- [ ] "Kazanılan Rozetler" bölümü düzgün görünüyor mu?
- [ ] Henüz rozet yoksa alan bozuk görünmüyor mu?

### 14. Çıkış yap ve tekrar giriş yap

- [ ] Ayarlar'dan çıkış yap.
- [ ] Aynı hesapla tekrar giriş yap.

### 15. Veriler geri geliyor mu?

- [ ] XP, ilerleme, tamamlanan dersler ve profil bilgileri geri geldi mi?
- [ ] (İsteğe bağlı, geliştiriciyle) Tarayıcı konsolunda `localStorage.clear()` çalıştırıp tekrar giriş yap — veriler Supabase'den geri geliyor mu?

### 16. Mobil kontrol (mobilde test ediyorsan)

- [ ] Alt navigasyonda **Ana Sayfa**, **Yol**, **Profil** yazıları okunuyor mu?
- [ ] Ana Sayfa, Yol, Ders ve Profil sayfalarında taşma veya sıkışma var mı?
- [ ] Butonlar ve giriş alanları rahat tıklanıyor mu?

---

## Geri bildirim soruları

Test sonunda aşağıdaki sorulara kısa cevap ver:

1. **İlk izlenimin neydi?** (İlk 30 saniyede ne hissettin?)
2. **Nerede kafan karıştı?** (Hangi ekran, buton veya metin?)
3. **Hangi ders kolaydı?**
4. **Hangi ders zor geldi?**
5. **XP / rozet / seri sistemi seni motive etti mi?** Neden?
6. **Mobilde bir şey taşmış veya zor tıklanmış mı?**
7. **Kod yazma soruları adil hissettirdi mi?**
8. **Kodmigo'yu tekrar kullanır mıydın?**
9. **Eklemek istediğin bir şey var mı?**

---

## Bilinen sınırlamalar (beta)

- Kodmigo şu an MVP / beta aşamasındadır.
- AI sohbet özelliği yoktur ve test kapsamına dahil değildir.
- Bazı dersler ve projeler henüz eklenmemiş olabilir.

---

## Sorun bildirimi

Bir hata bulursan şunları not et:

- Hangi sayfada olduğun
- Ne yapmaya çalıştığın
- Ne oldu / ne bekliyordun
- Mümkünse ekran görüntüsü
- Mobil mi, masaüstü mü kullandığın
