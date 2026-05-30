import os
import pywhatkit
import datetime
import time

def asistan_konus(metin):
    # Şimdilik terminale yazdırıyoruz, sonra bunu sese de çevirebiliriz
    print(f"🤖 Jarvis: {metin}")

def uygulama_ac(komut):
    komut = komut.lower()
    asistan_konus("Hemen hallediyorum kral...")
    
    if "blender" in komut:
        # Windows'ta uygulamayı başlatır
        os.system("start blender")
        asistan_konus("Blender başlatıldı, 3D sahneler hazır.")
        
    elif "fl studio" in komut:
        # FL Studio'nun bilgisayarındaki tam yolunu buraya yazman gerekebilir
        # Örnek: os.startfile("C:\\Program Files\\Image-Line\\FL Studio 20\\FL.exe")
        asistan_konus("FL Studio açılıyor, beatler hazırlansın...")
        
    elif "chrome" in komut or "tarayıcı" in komut:
        os.system("start chrome")
        asistan_konus("Google Chrome açıldı.")
        
    else:
        asistan_konus("Bu uygulamayı henüz sistemime tanımlamadın.")

def whatsapp_mesaj_at():
    # Jarvis'in beynindeki özel rehber (Sadece numara kısmını güncelleyebilirsin)
    rehber = {
        "usta": "5551112233",
        "kız kardeşim": "5559998877",
        "aşkım": "5066267883",
        "annem": "5077112996"
    }
    
    asistan_konus(f"Kime mesaj göndereceğiz? Kayıtlı kişiler: {', '.join(rehber.keys())}")
    kisi = input("Kişi: ").lower()
    
    if kisi in rehber:
        numara = rehber[kisi]
        asistan_konus(f"{kisi.capitalize()} için mesajın nedir?")
        mesaj = input("Mesaj: ")
        
        asistan_konus(f"{kisi.capitalize()} kişisine mesaj fırlatılıyor. Klavyeye ve fareye dokunma...")
        
        try:
            # Numarayı rehberden çekip WhatsApp'a iletiyor
            pywhatkit.sendwhatmsg_instantly(f"+90{numara}", mesaj, 15, True, 3)
            asistan_konus("Mesaj başarıyla iletildi!")
        except Exception as e:
            asistan_konus(f"Sistem hatası, mesaj gönderilemedi: {e}")
    else:
        asistan_konus("Bu kişiyi veri tabanımda (rehberimde) bulamadım. Lütfen koda ekle.")

# ==========================================
# ANA SİSTEM DÖNGÜSÜ
# ==========================================
asistan_konus("Sistemler devrede. Nasıl yardımcı olabilirim?")

while True:
    print("\nKomutlar: [uygulama aç] / [mesaj at] / [çıkış]")
    komut = input("Sen: ").lower()
    
    if "çıkış" in komut or "kapat" in komut:
        asistan_konus("Sistemler kapatılıyor. Görüşmek üzere!")
        break
        
    elif "aç" in komut or "başlat" in komut:
        uygulama_ac(komut)
        
    elif "mesaj" in komut or "whatsapp" in komut:
        whatsapp_mesaj_at()
        
    else:
        asistan_konus("Ne demek istediğini tam anlayamadım, tekrar eder misin?")