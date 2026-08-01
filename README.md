# Vicky's Creation — Website + Backend

Is folder mein aapki poori website hai (frontend + backend), jo contact form ka data collect karke local file mein save karti hai.

## Files
- `index.html` — website (contact form add kiya gaya hai)
- `style.css` — styling (form ka style bhi isi mein hai)
- `server.js` — Node.js backend (form data receive + save karta hai)
- `package.json` — dependencies list
- `data/submissions.json` — yahan saare leads (Naam, Phone, Email, Topic, Message) save honge

## Setup (ek baar)

1. [Node.js](https://nodejs.org) install karo (agar pehle se nahi hai) — LTS version le lo.
2. Terminal/CMD mein is folder ke andar jao:
   ```
   cd vicky-backend
   ```
3. Dependencies install karo:
   ```
   npm install
   ```

## Run Karo

```
npm start
```

Terminal mein ye dikhega:
```
✅ Vicky's Creation server running at http://localhost:3000
🔑 Admin panel: http://localhost:3000/admin?key=vicky123
```

Ab browser mein `http://localhost:3000` kholo — poori website chalegi, aur "Contact" section mein jo form hai, wo submit hone par data seedha `data/submissions.json` file mein save hoga.

## Leads Dekhna (Admin Panel)

Browser mein ye URL kholo:
```
http://localhost:5500/admin?key=vicky123
```

Yahan aapko table mein saari submissions dikhengi, aur "Download as CSV" button se Excel mein bhi kholi ja sakti hai.

⚠️ **Important:** `vicky123` sirf ek default key hai. Ise `server.js` file mein jaake `ADMIN_KEY` variable mein change kar do (top ke paas), taaki koi aur aapka data na dekh paye.

## Ye Website Live (Internet pe) Kaise Karein?

Abhi ye sirf aapke computer pe (`localhost`) chal rahi hai. Internet pe live karne ke liye aap free/cheap hosting use kar sakte ho jo Node.js support kare, jaise:
- **Render.com** (free tier available)
- **Railway.app**
- **Vercel / Netlify** (thoda alag setup lagega, ye zyada static-site ke liye better hain)

Bas apna poora `vicky-backend` folder waha upload/deploy karna hoga (GitHub ke through), aur wo automatically `npm install` + `npm start` chala denge.

## Notes
- Phone number validation hai — 10-digit Indian mobile number chahiye.
- Email optional hai (khaali chhod sakte ho).
- Data ek simple JSON file mein store hota hai — agar aage chal ke bahut zyada leads aane lagein, to hum isko proper database (jaise SQLite ya MongoDB) mein upgrade kar sakte hain.
