import os
from flask import Flask, jsonify
from flask_cors import CORS
import spotipy
from spotipy.oauth2 import SpotifyOAuth

app = Flask(__name__)
CORS(app)  # Live Server (5500) ile Python (5000) arasındaki güvenlik duvarını kaldırır

REDIRECT_URI = "http://localhost:8080/callback"
# Son çalınanlar iznini de (user-read-recently-played) pakete dahil ettik
scope = "user-read-currently-playing user-read-playback-state user-read-recently-played"

# Şifreleri ve izinleri doğrudan kütüphanenin içine çakıyoruz ki hata vermesin
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id="25456167d8464e31afd395586dc81c54",
    client_secret="65c474934bdb4e9ea5afc2328a6938c8",
    redirect_uri=REDIRECT_URI,
    scope=scope
))

@app.route('/api/spotify', methods=['GET'])
def get_spotify():
    try:
        # 1. Şu an canlıda şarkı oynatılıyor mu?
        playback = sp.current_playback()
        if playback and playback.get('is_playing'):
            return jsonify({
                "durum": "active",
                "sarki": playback['item']['name'],
                "sanatci": playback['item']['artists'][0]['name']
            })
        
        # 2. Canlıda yoksa en son ne dinlenmiş ona bak
        try:
            recent = sp.current_user_recently_played(limit=1)
            if recent and 'items' in recent and len(recent['items']) > 0:
                track = recent['items'][0]['track']
                return jsonify({
                    "durum": "recent",
                    "sarki": track['name'],
                    "sanatci": track['artists'][0]['name']
                })
        except Exception:
            pass  # Spotify geçmişi boşsa veya hata verirse sistemi çökertme, aşağı kaydır
            
        # 3. İkisi de yoksa siber sessizlik modu
        return jsonify({
            "durum": "inactive", 
            "sarki": "Müzik Açık Değil", 
            "sanatci": "Spotify'dan bir şarkı oynatın..."
        })
        
    except Exception as e:
        return jsonify({"durum": "error", "mesaj": str(e)})

if __name__ == "__main__":
    app.run(port=5000, debug=True)