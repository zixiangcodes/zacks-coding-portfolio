# Zack's Coding Portfolio

Quick start:

```bash
npm install
cp .env.example .env
# Edit .env and add your Firebase config (from Firebase Console > Project settings)
npm start
```

Head over to https://vitejs.dev/ to learn more about using Vite.

---

## Environment variables & deployment

Firebase config is **not** stored in the repo. You must provide it via environment variables.

### Local development

1. Copy the example file: `cp .env.example .env`
2. Open `.env` and fill in your Firebase Web App config (from [Firebase Console](https://console.firebase.google.com/) → Project settings → Your apps).
3. Run `npm start`.

### Deploying on Netlify

1. **Build settings** (Site settings → Build & deploy):
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

2. **Environment variables** (Site settings → Environment variables): add each of these (with your real values):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_DATABASE_URL`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

3. Redeploy so the build uses the new env vars.

**Security note:** Firebase client API keys are intended to be public in the built app; security is enforced by Firebase Security Rules and by restricting the API key to your domain in [Google Cloud Console](https://console.cloud.google.com/) (APIs & Services → Credentials). Keeping config in env vars avoids committing secrets to git and makes rotation easier.
## About Scrimba

At Scrimba our goal is to create the best possible coding school at the cost of a gym membership! 💜
If we succeed with this, it will give anyone who wants to become a software developer a realistic shot at succeeding, regardless of where they live and the size of their wallets 🎉
The Frontend Developer Career Path aims to teach you everything you need to become a Junior Developer, or you could take a deep-dive with one of our advanced courses 🚀

- [Our courses](https://scrimba.com/allcourses)
- [The Frontend Career Path](https://scrimba.com/learn/frontend)
- [Become a Scrimba Pro member](https://scrimba.com/pricing)

Happy Coding!
