# AvoHire — Complete Setup Guide

## Quick Start (No Backend)
1. Extract ZIP
2. Open `landing.html` in Chrome or Edge
3. Sign up → Practice → Done!

> **Important:** Use Chrome or Edge for best experience.  
> Voice recognition (Web Speech API) does NOT work in Firefox.

---

## What Works Without Backend
- ✅ Signup / Login (localStorage)
- ✅ Mock Interviews with voice recording
- ✅ Face detection & cheat monitoring  
- ✅ Resume parsing & auto-fill
- ✅ AI feedback (smart offline analysis)
- ✅ PDF report export
- ✅ Profile photo (upload + webcam)
- ✅ All settings, dark mode, etc.

---

## Do You Need a Backend?

**No backend needed for:** Everything listed above.

**Backend needed for:**
- Google / LinkedIn OAuth login
- Cloud storage of interview data (across devices)
- Real AI feedback (Claude/OpenAI API)
- Email notifications
- Team dashboard (multi-user)

---

## Adding Google OAuth (Free — Firebase)

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create new project → Authentication → Sign-in methods → Enable **Google**
3. Add this to `login.html` before `</body>`:
```html
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.0.0/firebase-auth-compat.js"></script>
<script>
  firebase.initializeApp({
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID"
  });
  window.googleSignIn = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await firebase.auth().signInWithPopup(provider);
    const user = result.user;
    // Save to localStorage and redirect
    localStorage.setItem('iq_current_user', JSON.stringify({ name: user.displayName, email: user.email }));
    window.location.href = 'dashboard.html';
  };
</script>
```
4. Replace `googleBtn` click handler in `script.js` with `window.googleSignIn()`

---

## Adding LinkedIn OAuth
LinkedIn OAuth requires a backend server (cannot be done purely frontend due to CORS).

**Easiest free option:** Use [Supabase](https://supabase.com) (free tier)
1. Create Supabase project → Authentication → LinkedIn provider
2. Install Supabase JS: `npm install @supabase/supabase-js`
3. Use `supabase.auth.signInWithOAuth({ provider: 'linkedin' })`

---

## Adding Real AI Feedback (Claude API)
In `script.js`, replace `getAIFeedback` function with:
```javascript
async function getAIFeedback(question, answer) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': 'YOUR_CLAUDE_API_KEY',
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001', // cheapest model
      max_tokens: 500,
      // ... (rest of the prompt)
    })
  });
}
```
> **Note:** Exposing API keys in frontend is unsafe for production.  
> Use a backend proxy (Netlify Functions / Vercel Edge Functions) to hide the key.

---

## File Structure
```
avohire_v2/
├── landing.html      # Home page with pricing
├── login.html        # Sign in
├── signup.html       # Register
├── dashboard.html    # Main dashboard
├── interview.html    # Mock interview (voice + camera)
├── question-bank.html# Browse 500+ questions
├── reports.html      # Analytics + PDF export
├── profile.html      # Edit profile + resume upload
├── settings.html     # All settings
├── script.js         # All app logic
├── style.css         # All styles
└── README.md         # This file
```
