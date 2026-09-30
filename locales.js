(() => {
  'use strict';

  const translations = {
    'Başvuru formuna geç': 'Zum Anmeldeformular',
    'Hakkımızda': 'Über uns',
    'Program': 'Programm',
    'Katılım': 'Teilnahme',
    'Başvuru': 'Anmeldung',
    'Başvur': 'Jetzt anmelden',
    'Çocuk Kulübü başlıyor': 'Der Kinderclub startet',
    'Sevgi, düzen, değerler ve yaratıcılık temelli bir çocuk kulübü deneyimi. Çocuğunuzun kendini güvenle ifade edebileceği, birlikte öğrenip büyüdüğü bir ortam.': 'Ein Kinderclub, der auf Geborgenheit, Struktur, Werten und Kreativität basiert. Ein Ort, an dem Ihr Kind sich sicher ausdrücken und gemeinsam lernen und wachsen kann.',
    'Ders detayları': 'Kursinhalte',
    'Kayıt Açık': 'Anmeldung geöffnet',
    'Çocuk Kulübü': 'Kinderclub',
    'Yaratıcı atölyeler, oyun, ritim, değerler eğitimi ve güvenli öğrenme alanı.': 'Kreative Workshops, Spiel, Rhythmus, Wertevermittlung und ein geschützter Lernraum.',
    'Ayda bir pazar günü': 'Ein Sonntag im Monat',
    'Sevgi dolu yaklaşım': 'Ein liebevoller Umgang',
    'SINIRLI KONTENJAN': 'BEGRENZTE PLÄTZE',
    'Dersler: Ayda bir pazar günü': 'Kurse: ein Sonntag im Monat',
    'İlk ders: 11.10.2026': 'Erster Kurstag: 11.10.2026',
    '6–8 yaş': '6–8 Jahre',
    'Biz kimiz?': 'Wer sind wir?',
    'Fulya Akademi, çocukların değerlerle büyüdüğü bir eğitim alanıdır.': 'Die Fulya Akademie ist ein Ort, an dem Kinder mit Werten aufwachsen.',
    'Fulya Akademi, Human Sufi Kültür Sanat Derneği çatısı altında çocuklara sevgi, düzen, saygı, yaratıcılık ve kültürel değerler doğrultusunda gelişim fırsatı sunar.': 'Die Fulya Akademie bietet Kindern unter dem Dach des Vereins Human Sufi Kültür Sanat Möglichkeiten zur Entwicklung in einem Umfeld von Liebe, Struktur, Respekt, Kreativität und kulturellen Werten.',
    'Oyun, ifade, birlikte öğrenme ve manevi bilinç temelli yaklaşımımızla çocuklarımızın güvenli ve mutlu bir şekilde gelişmesini hedefliyoruz.': 'Mit Spiel, Ausdruck, gemeinsamem Lernen und spirituellem Bewusstsein möchten wir die Kinder sicher und glücklich in ihrer Entwicklung begleiten.',
    'Ana program': 'Unser Programm',
    'Ders İçeriği': 'Kursinhalte',
    'Âdâb-ı Muâşeret': 'Gutes Benehmen und Umgangsformen',
    'Edepli davranış ve görgü kuralları ile nezaket, saygı, merhamet ve güzel iletişim becerileri geliştirilir.': 'Mit guten Umgangsformen fördern wir Höflichkeit, Respekt, Mitgefühl und eine wertschätzende Kommunikation.',
    '40 Hadis': '40 Hadithe',
    'Yaş grubuna uygun hadisler üzerinden değerler eğitimi, ahlak ve günlük hayattaki güzel davranışlar işlenir.': 'Altersgerechte Hadithe vermitteln Werte, Moral und gutes Verhalten im Alltag.',
    'Meşk': 'Gemeinsames Musizieren',
    'Ses, ritim ve birlikte söyleme yoluyla çocukların ifade gücü, dikkati ve aidiyet duygusu desteklenir.': 'Mit Stimme, Rhythmus und gemeinsamem Singen stärken wir Ausdruck, Aufmerksamkeit und Gemeinschaftsgefühl der Kinder.',
    'Oyun ve sosyal etkinlikler': 'Spiel und soziale Aktivitäten',
    'Çocukların yaşlarına uygun oyun, grup çalışması ve sosyalleşme etkinlikleriyle keyifli öğrenme sağlanır.': 'Altersgerechte Spiele, Gruppenarbeit und gemeinsame Aktivitäten machen das Lernen lebendig.',
    'Lokma': 'Gemeinsames Frühstück',
    'Çocuklarımızla birlikte sofrada buluşuyor, toplu dualarla güne bereket ve şükür duygusuyla başlıyor, dini değerlerimizi paylaşarak güzel bir kahvaltı ediyoruz.': 'Wir kommen gemeinsam an einem Tisch zusammen, beginnen den Tag mit Gebeten und Dankbarkeit und teilen beim Frühstück unsere religiösen Werte.',
    'Derslerimiz': 'Unsere Kurse',
    'Güzel Ahlak': 'Guter Charakter',
    'Ses, ritim ve toplu söyleyişle müzik ve ifade becerilerini geliştirme': 'Mit Stimme, Rhythmus und gemeinsamem Singen musikalischen Ausdruck fördern',
    'Organizatör': 'Veranstalter',
    'Dernek Hakkında': 'Über den Verein',
    'Almanya': 'Deutschland',
    'Human – Sufi Culture and Arts Derneği, Mevlana Celaleddin Rumi\'nin öğretileri doğrultusunda Sufi geleneklerini yaşatmayı ve aktarmayı hedefleyen genç Müslüman akademisyenlerin bir araya gelmesiyle kurulmuştur.': 'Der Verein Human – Sufi Culture and Arts wurde von jungen muslimischen Akademikerinnen und Akademikern gegründet, die Sufi-Traditionen im Sinne der Lehren Mevlana Celaleddin Rumis bewahren und weitergeben möchten.',
    'İnsanı ilahi yaratılışın en yüce varlığı olarak kabul eden tasavvuf, temel ilham kaynağımızdır. Merhamet, sevgi ve anlayış üzerine uyumlu bir toplumsal yaşamı destekliyoruz.': 'Der Sufismus, der den Menschen als ein besonders wertvolles Geschöpf Gottes versteht, ist unsere wichtigste Inspiration. Wir setzen uns für ein von Mitgefühl, Liebe und Verständnis geprägtes Zusammenleben ein.',
    'human-culture.com →': 'human-culture.com →',
    '20 € ': '20 € ',
    'ders başına': 'pro Kurstermin',
    '3 aylık dönem için önden ödeme. Uzman eğitmenler eşliğinde düzenli, güvenli ve sevgi dolu bir gelişim ortamı.': 'Vorauszahlung für einen Zeitraum von drei Monaten. Ein regelmäßiges, sicheres und liebevolles Lernumfeld mit erfahrenen Kursleitungen.',
    'Detaylar': 'Details',
    'Derslerimiz ayda bir pazar günleri yapılacaktır. İlk ders tarihi 11.10.2026\'dır; saat ve buluşma detayları kayıt sonrası iletişim ile paylaşılır.': 'Die Kurse finden einmal im Monat sonntags statt. Der erste Kurstag ist der 11.10.2026. Uhrzeit und Treffpunkt teilen wir nach der Anmeldung mit.',
    'Kayıt': 'Anmeldung',
    'Çocuk Kulübü için başvurun': 'Melden Sie Ihr Kind für den Kinderclub an',
    'Üç adımda tamamlanır: yaş kontrolü, başvuru bilgileri, banka havalesi. Kayıt kesinleşince sizi bilgilendiririz.': 'Die Anmeldung erfolgt in drei Schritten: Altersprüfung, Angaben zum Kind und Überweisung. Wir informieren Sie, sobald die Anmeldung bestätigt ist.',
    'İletişim': 'Kontakt',
    'Başvuru adımları': 'Anmeldeschritte',
    'Yaş': 'Alter',
    'Çocuk': 'Kind',
    'İletişim ve izinler': 'Kontakt und Einwilligungen',
    'Havale': 'Überweisung',
    '. adım / 4': '. von 4 Schritten',
    'Önce yaş uygunluğunu kontrol edin': 'Prüfen Sie zuerst die Altersvoraussetzungen',
    'Çocuğunuzun doğum tarihini seçin. Uygunluk hemen kontrol edilir.': 'Wählen Sie das Geburtsdatum Ihres Kindes. Die Teilnahmeberechtigung wird sofort geprüft.',
    'Kimler başvurabilir?': 'Wer kann sich anmelden?',
    'Çocuğunuzun okula başlamış olması gerekir.': 'Ihr Kind muss bereits eingeschult sein.',
    'Grup 1': 'Gruppe 1',
    '1. sınıf': '1. Klasse',
    '1. Sınıf': '1. Klasse',
    '2. Sınıf': '2. Klasse',
    '3. Sınıf': '3. Klasse',
    '4. Sınıf': '4. Klasse',
    'Grup 2': 'Gruppe 2',
    '2. ve 3. sınıf': '2. und 3. Klasse',
    '6 yaş': '6 Jahre',
    '7–8 yaş': '7–8 Jahre',
    'Doğum tarihi': 'Geburtsdatum',
    'Devam et': 'Weiter',
    'Çocuğun bilgileri': 'Angaben zum Kind',
    'Bu bilgiler kayıt ve gruplama için gerekli.': 'Diese Angaben benötigen wir für die Anmeldung und Gruppeneinteilung.',
    'Çocuğun adı': 'Vorname des Kindes',
    'Örnek: Ayşe': 'Zum Beispiel: Ayşe',
    'Çocuğun soyadı': 'Nachname des Kindes',
    'Örnek: Yılmaz': 'Zum Beispiel: Yılmaz',
    'Cinsiyet': 'Geschlecht',
    'Seçiniz': 'Bitte auswählen',
    'Kız': 'Mädchen',
    'Erkek': 'Junge',
    'Anne adı': 'Name der Mutter',
    'Örnek: Ayşe Yılmaz': 'Zum Beispiel: Ayşe Yılmaz',
    'Baba adı': 'Name des Vaters',
    'Örnek: Mehmet Yılmaz': 'Zum Beispiel: Mehmet Yılmaz',
    'Zorunlu değil': 'Freiwillige Angabe',
    'Okulda kaçıncı sınıfta?': 'Welche Klasse besucht Ihr Kind?',
    'Sınıf seçin': 'Klasse auswählen',
    'Grup 1 arama': 'Suche Gruppe 1',
    'Grup 2 arama': 'Suche Gruppe 2',
    'Grup 1 durum filtresi': 'Statusfilter Gruppe 1',
    'Grup 2 durum filtresi': 'Statusfilter Gruppe 2',
    'Evet': 'Ja',
    'Hayır': 'Nein',
    'Yok': 'Keine',
    'Ana menü': 'Hauptmenü',
    'Fulya Akademi logo': 'Fulya-Akademie-Logo',
    'Çocuk Kulübü kartı': 'Kinderclub-Karte',
    'Adres bilgileri': 'Anschrift',
    'Sokak ve ev numarası': 'Straße und Hausnummer',
    'Ehringhausen 25': 'Ehringhausen 25',
    'Posta kodu': 'Postleitzahl',
    'Şehir': 'Stadt',
    'Remscheid': 'Remscheid',
    'Geri': 'Zurück',
    'Kayıt sonrası size buradan ulaşacağız.': 'Wir kontaktieren Sie nach der Anmeldung über diese Angaben.',
    'E-posta adresi': 'E-Mail-Adresse',
    'Telefon numarası': 'Telefonnummer',
    'Alerji var mı?': 'Gibt es Allergien?',
    'Varsa lütfen açıklayın. Yoksa “Yok” yazabilirsiniz.': 'Bitte beschreiben Sie vorhandene Allergien. Wenn keine bestehen, schreiben Sie „Keine“.',
    'Datenschutz: Bilgilerimin başvuru amacıyla işlenmesine izin veriyorum.': 'Datenschutz: Ich willige ein, dass meine Angaben für die Anmeldung verarbeitet werden.',
    'Etkinliklerde çekilen fotoğraflarımın dernek iletişim kanallarında kullanılmasına izin veriyorum.': 'Ich willige ein, dass bei Veranstaltungen aufgenommene Fotos über die Kommunikationskanäle des Vereins veröffentlicht werden dürfen.',
    'Çocuk Kulübü WhatsApp grubuna katılmama izin veriyorum.': 'Ich willige ein, der WhatsApp-Gruppe des Kinderclubs beizutreten.',
    'Gönderilecek bilgiler': 'Zusammenfassung Ihrer Angaben',
    'Başvuruyu gönder': 'Anmeldung absenden',
    'Teşekkür ederiz, başvurunuz bize ulaştı.': 'Vielen Dank, Ihre Anmeldung ist bei uns eingegangen.',
    'Çocuğunuz için gösterdiğiniz ilgiye çok sevindik.': 'Wir freuen uns über Ihr Interesse an unserem Kinderclub.',
    'E-posta kutunuzu kontrol edin': 'Bitte prüfen Sie Ihr E-Mail-Postfach',
    'Başvuru bilgilerinizi ve havale detaylarını içeren bir onay e-postası gönderdik. Birkaç dakika içinde ulaşmazsa lütfen spam / junk (gereksiz) klasörünüze de bakın.': 'Wir haben Ihnen eine Bestätigung mit den Anmeldedaten und Überweisungsinformationen gesendet. Falls sie nicht innerhalb weniger Minuten ankommt, prüfen Sie bitte auch Ihren Spam-Ordner.',
    'E-postayı bulamazsanız bize': 'Falls Sie die E-Mail nicht finden, erreichen Sie uns unter',
    'numarasından ulaşabilirsiniz.': '.',
    'Banka havalesi': 'Banküberweisung',
    'IBAN ve havale bilgilerini içeren QR kodu': 'QR-Code mit IBAN und Überweisungsdaten',
    'Bankacılık uygulamanızla okutabilirsiniz.': 'Scannen Sie den Code mit Ihrer Banking-App.',
    'IBAN': 'IBAN',
    'Kopyala': 'Kopieren',
    'Alıcı': 'Empfänger',
    'Tutar': 'Betrag',
    '60 € · 3 aylık önden ödeme': '60 € · Vorauszahlung für 3 Monate',
    'Açıklama': 'Verwendungszweck',
    'Fulya Academy - Çocuğun adı ve soyadı': 'Fulya Academy - Vor- und Nachname des Kindes',
    'Havale açıklaması nasıl yazılmalı?': 'Was gehört in den Verwendungszweck?',
    'Açıklama bölümüne mutlaka': 'Bitte geben Sie im Verwendungszweck unbedingt',
    'Fulya Academy - çocuğun adı ve soyadını': 'Fulya Academy - Vor- und Nachname des Kindes',
    'yazın.': 'an.',
    'yazın. Böylece ödemenizi doğru başvuruyla eşleştirebiliriz.': 'an. So können wir Ihre Zahlung der richtigen Anmeldung zuordnen.',
    'Böylece ödemenizi doğru başvuruyla eşleştirebiliriz.': 'So können wir Ihre Zahlung der richtigen Anmeldung zuordnen.',
    'Yukarı çık': 'Nach oben',
    'Fulya Academy': 'Fulya Akademie',
    'Başvurunuz bize ulaştı.': 'Ihre Anmeldung ist bei uns eingegangen.',
    'Bu alan zorunlu.': 'Dieses Feld ist erforderlich.',
    'Devam etmek için bu izin gerekli.': 'Diese Einwilligung ist erforderlich, um fortzufahren.',
    'Geçerli bir e-posta adresi girin. Örnek: isim@email.com': 'Bitte geben Sie eine gültige E-Mail-Adresse ein, zum Beispiel name@email.com.',
    'Telefon numarasını eksiksiz girin.': 'Bitte geben Sie die vollständige Telefonnummer ein.',
    'Posta kodu 5 haneli olmalı. Örnek: 42859': 'Die Postleitzahl muss fünfstellig sein, zum Beispiel 42859.',
    'Devam etmek için çocuğunuzun doğum tarihini seçin.': 'Bitte wählen Sie das Geburtsdatum Ihres Kindes, um fortzufahren.',
    'Bu tarih okunamadı. Lütfen tekrar seçin.': 'Dieses Datum ist ungültig. Bitte wählen Sie es erneut aus.',
    'küçük': 'zu jung',
    'büyük': 'zu alt',
    'Çocuğunuz bu program için': 'Ihr Kind ist für dieses Programm',
    'yaş': 'Jahre',
    'Kayıt 6–8 yaş arası ve okula başlamış çocuklar içindir.': 'Teilnehmen können eingeschulte Kinder im Alter von 6 bis 8 Jahren.',
    'Yaş uygun': 'Alter passend',
    'Devam edebilirsiniz.': 'Sie können fortfahren.',
    'Lütfen eksik alanları tamamlayın.': 'Bitte ergänzen Sie die fehlenden Angaben.',
    'Başvurunuz gönderiliyor…': 'Ihre Anmeldung wird gesendet …',
    'Başvuru kaydedilemedi. Lütfen tekrar deneyin.': 'Die Anmeldung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.',
    'Bağlantı kurulamadı. İnternet bağlantınızı kontrol edip tekrar deneyin.': 'Keine Verbindung. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.',
    'Kopyalandı': 'Kopiert',
    'Kopyalanamadı': 'Kopieren fehlgeschlagen',
    'Başvurular yönetimi': 'Anmeldungen verwalten',
    'Yönetim paneline girmek için şifrenizi yazın.': 'Bitte geben Sie Ihr Passwort ein, um das Admin-Panel zu öffnen.',
    'Yönetici şifresi': 'Admin-Passwort',
    'Giriş yap': 'Anmelden',
    'Başvurular': 'Anmeldungen',
    'Yeni kayıtları buradan takip edebilirsiniz.': 'Hier können Sie neue Anmeldungen verwalten.',
    'Çıkış yap': 'Abmelden',
    'Mail-Vorschau: Kontaktiert': 'E-Mail-Vorschau: kontaktiert',
    'Mail-Vorschau: Bezahlt': 'E-Mail-Vorschau: bezahlt',
    'Test-E-Mail-Adresse': 'Test-E-Mail-Adresse',
    'Testmail senden': 'Test-E-Mail senden',
    'çocuk': 'Kinder',
    'Bu tabloyu ara...': 'Diese Tabelle durchsuchen …',
    'Tüm durumlar': 'Alle Status',
    'CSV indir': 'CSV herunterladen',
    'Tarih': 'Datum',
    'Çocuk': 'Kind',
    'Cinsiyet': 'Geschlecht',
    'Doğum tarihi': 'Geburtsdatum',
    'Sınıf': 'Klasse',
    'Anne': 'Mutter',
    'Baba': 'Vater',
    'Stadt': 'Ort',
    'Alerji': 'Allergien',
    'Fotoğraf': 'Foto-Einwilligung',
    'Durum': 'Status',
    'İşlem': 'Aktion',
    'Sil': 'Löschen',
    'Bu grupta henüz başvuru bulunmuyor.': 'Für diese Gruppe gibt es noch keine Anmeldungen.',
    'Bu filtrelerle eşleşen başvuru bulunmuyor.': 'Keine Anmeldungen entsprechen diesen Filtern.',
    'başvuru gösteriliyor.': 'Anmeldungen werden angezeigt.',
    'Status gespeichert.': 'Status gespeichert.',
    'Durum kaydedilemedi.': 'Status konnte nicht gespeichert werden.',
    'Durum kaydedildi.': 'Status gespeichert.',
    'Durum kaydedildi ve bilgilendirme e-postası gönderildi.': 'Status gespeichert und Benachrichtigungs-E-Mail gesendet.',
    'Durum kaydedildi, ancak e-posta gönderilmedi: .env dosyasına Azure bilgilerini ekleyin.': 'Status gespeichert, aber keine E-Mail versendet. Bitte Azure-Daten in .env ergänzen.',
    'Bağlantı kurulamadı. Lütfen tekrar deneyin.': 'Verbindung fehlgeschlagen. Bitte versuchen Sie es erneut.',
    'Başvurular yüklenemedi.': 'Anmeldungen konnten nicht geladen werden.',
    'Sunucuya ulaşılamadı.': 'Server nicht erreichbar.',
    'Anmeldung wurde gelöscht.': 'Anmeldung wurde gelöscht.',
    'Anmeldung konnte nicht gelöscht werden. Bitte Seite neu laden und erneut versuchen.': 'Anmeldung konnte nicht gelöscht werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.',
    'Bitte zuerst eine Test-E-Mail-Adresse eingeben.': 'Bitte zuerst eine Test-E-Mail-Adresse eingeben.',
    'Testmail wurde gesendet.': 'Test-E-Mail wurde gesendet.',
    'Testmail konnte nicht gesendet werden.': 'Test-E-Mail konnte nicht gesendet werden.',
    'Gönderiliyor…': 'Wird gesendet …',
    'Neu': 'Neu',
    'Kontaktiert': 'Kontaktiert',
    'Bezahlt': 'Bezahlt',
    'Abgeschlossen': 'Abgeschlossen',
    'Grup 1 · 6 yaş': 'Gruppe 1 · 6 Jahre',
    'Grup 2 · 7–8 yaş': 'Gruppe 2 · 7–8 Jahre',
    'Lütfen tüm zorunlu alanları doldurun.': 'Bitte füllen Sie alle Pflichtfelder aus.',
    'Bu başvuru yalnızca 6–8 yaş aralığındaki çocuklar için uygundur.': 'Diese Anmeldung ist nur für eingeschulte Kinder im Alter von 6 bis 8 Jahren möglich.',
    'Bu grup için artık başvuru kabul edilemiyor.': 'Für diese Gruppe sind keine weiteren Anmeldungen möglich.',
    'Başvuru kaydedilemedi.': 'Die Anmeldung konnte nicht gespeichert werden.',
    'Yetkisiz erişim.': 'Nicht autorisierter Zugriff.',
    'Şifre hatalı.': 'Das Passwort ist falsch.',
    'Ungültiger Status.': 'Ungültiger Status.',
    'Anmeldung nicht gefunden.': 'Anmeldung nicht gefunden.',
    'Başvuru bulunamadı.': 'Anmeldung nicht gefunden.',
    'Başvuru sunucu tarafından silinemedi.': 'Die Anmeldung konnte auf dem Server nicht gelöscht werden.',
    'Başvuru silindi.': 'Anmeldung wurde gelöscht.',
    'Başvuru silinemedi. Lütfen sayfayı yenileyip tekrar deneyin.': 'Anmeldung konnte nicht gelöscht werden. Bitte laden Sie die Seite neu und versuchen Sie es erneut.',
    'Edepli davranış ve görgü kuralları': 'Gutes Benehmen und Umgangsformen',
    'Edepli davranış ve görgü kuralları ile nezaket, saygı, merhamet ve güzel iletişim becerileri geliştirilir.': 'Gutes Benehmen und Umgangsformen fördern Höflichkeit, Respekt, Mitgefühl und eine wertschätzende Kommunikation.',
    '2. ve 3. sınıf': '2. und 3. Klasse',
    'ders başına': 'pro Kurstermin',
    'Üç adımda tamamlanır: yaş kontrolü, başvuru bilgileri, banka havalesi.': 'Die Anmeldung erfolgt in drei Schritten: Altersprüfung, Angaben zum Kind und Überweisung.',
    'Kayıt kesinleşince sizi bilgilendiririz.': 'Wir informieren Sie, sobald die Anmeldung bestätigt ist.',
    'Önce yaş uygunluğunu kontrol edin': 'Prüfen Sie zuerst die Altersvoraussetzungen',
    'Aşağıda başvuru bilgileriniz ve son adım olan banka havalesi yer alıyor.': 'Unten finden Sie Ihre Angaben und die Überweisungsinformationen.',
    'gönderdik. Birkaç dakika içinde ulaşmazsa lütfen': 'Falls die E-Mail nicht innerhalb weniger Minuten ankommt, prüfen Sie bitte',
    'spam / junk (gereksiz) klasörünüze': 'auch Ihren Spam-Ordner',
    'de bakın.': '.',
    'numarasından ulaşabilirsiniz.': 'telefonisch.',
    'Ödeme hesabımıza ulaştıktan sonra kaydınızı kesinleştirir ve size bilgi veririz.': 'Sobald Ihre Zahlung eingegangen ist, bestätigen wir die Anmeldung und informieren Sie.',
    'Açıklama bölümüne mutlaka': 'Bitte geben Sie als Verwendungszweck unbedingt',
    'Fulya Academy - çocuğun adı ve soyadını': 'Fulya Academy - Vor- und Nachname des Kindes',
    'yazın.': 'an.',
    'Sprache / Dil': 'Sprache',
    '🇹🇷 Türkçe': '🇹🇷 Türkisch',
    '🇩🇪 Deutsch': '🇩🇪 Deutsch',
    'Seçiniz': 'Bitte auswählen',
    'Sınıf seçin': 'Klasse auswählen',
    'isim@email.com': 'name@email.com',
    'Human – Sufi Culture and Arts Derneği, Mevlana Celaleddin Rumi\'nin öğretileri doğrultusunda Sufi geleneklerini yaşatmayı ve aktarmayı hedefleyen genç Müslüman akademisyenlerin bir araya gelmesiyle kurulmuştur.': 'Der Verein Human – Sufi Culture and Arts wurde von jungen muslimischen Akademikerinnen und Akademikern gegründet, die Sufi-Traditionen im Sinne der Lehren Mevlana Celaleddin Rumis bewahren und weitergeben möchten.',
    'Derslerimiz ayda bir pazar günleri yapılacaktır. İlk ders tarihi 11.10.2026\'dır; saat ve buluşma detayları kayıt sonrası iletişim ile paylaşılır.': 'Die Kurse finden einmal im Monat sonntags statt. Der erste Kurstag ist der 11.10.2026. Uhrzeit und Treffpunkt teilen wir nach der Anmeldung mit.',
    'human-culture.com': 'human-culture.com',
    'Fulya Akademi | Çocuk Başvuru & Kayıt': 'Fulya Akademie | Anmeldung zum Kinderclub',
    'Straße': 'Straße',
    'Sokak': 'Straße',
    'PLZ': 'PLZ',
    'E-posta': 'E-Mail',
    'Telefon': 'Telefon',
    'Adres': 'Anschrift',
    'Başvuru bilgilerinizi ve havale detaylarını içeren bir onay e-postası gönderdik. Birkaç dakika içinde ulaşmazsa lütfen': 'Wir haben Ihnen eine Bestätigung mit Anmeldedaten und Überweisungsinformationen gesendet. Falls sie nicht innerhalb weniger Minuten ankommt, prüfen Sie bitte',
    'Bitte auswählen': 'Bitte auswählen',
    'Ana menü': 'Hauptmenü',
    'Fulya Akademi logo': 'Fulya-Akademie-Logo',
    'Çocuk Kulübü kartı': 'Kinderclub-Karte',
    'Yok': 'Keine',
    'Stadt': 'Stadt'
  };

  const normalize = (value) => value.replace(/\s+/g, ' ').trim();
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let language = 'tr';

  const translateAttribute = (element, name) => {
    let values = originalAttributes.get(element);
    if (!values) {
      values = new Map();
      originalAttributes.set(element, values);
    }
    if (!values.has(name)) values.set(name, element.getAttribute(name));
    const original = values.get(name);
    const translated = language === 'de' ? translations[normalize(original)] : original;
    if (translated !== undefined && translated !== null) element.setAttribute(name, translated);
  };

  const translatePage = (nextLanguage) => {
    language = nextLanguage === 'de' ? 'de' : 'tr';
    document.documentElement.lang = language;
    const isAdminPage = document.documentElement.dataset.page === 'admin';
    document.title = isAdminPage
      ? (language === 'de' ? 'Fulya | Anmeldungen' : 'Fulya | Başvurular')
      : (language === 'de' ? 'Fulya Akademie | Anmeldung zum Kinderclub' : 'Fulya Akademi | Çocuk Başvuru & Kayıt');
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      const originalDescription = 'Fulya çocuk başvuru ve kayıt sayfası. Veliler çocuklarını kolay, güvenli ve profesyonel şekilde başvuru formu üzerinden kaydedebilir.';
      description.content = language === 'de'
        ? 'Anmeldung zum Fulya-Kinderclub. Eltern können ihre Kinder einfach, sicher und bequem über das Anmeldeformular anmelden.'
        : originalDescription;
    }

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!node.nodeValue.trim()) continue;
      if (!originalText.has(node)) originalText.set(node, node.nodeValue);
      const original = originalText.get(node);
      const translated = language === 'de' ? translations[normalize(original)] : original;
      if (translated === undefined) continue;
      const leading = original.match(/^\s*/)?.[0] || '';
      const trailing = original.match(/\s*$/)?.[0] || '';
      node.nodeValue = `${leading}${translated}${trailing}`;
    }

    document.querySelectorAll('[placeholder]').forEach((element) => {
      translateAttribute(element, 'placeholder');
    });
    document.querySelectorAll('[aria-label]').forEach((element) => {
      translateAttribute(element, 'aria-label');
    });
    document.querySelectorAll('[alt]').forEach((element) => {
      translateAttribute(element, 'alt');
    });
    document.querySelectorAll('[title]').forEach((element) => {
      translateAttribute(element, 'title');
    });

    document.querySelectorAll('[data-language-select]').forEach((select) => {
      select.value = language;
    });
    window.dispatchEvent(new CustomEvent('fulya:languagechange', { detail: { language } }));
  };

  window.FulyaLocale = {
    get language() { return language; },
    t(value) { return language === 'de' ? (translations[value] || value) : value; },
    translatePage
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-language-select]').forEach((select) => {
      select.addEventListener('change', () => translatePage(select.value));
    });
    translatePage('tr');
  });
})();
