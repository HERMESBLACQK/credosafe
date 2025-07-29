# CredoSafe Deployment Guide

This guide will help you deploy your CredoSafe application to various hosting platforms without getting 404 errors on your routes.

## 🚀 Quick Fix Summary

The 404 errors occur because hosting platforms don't know how to handle React Router's client-side routing. We've added configuration files to fix this:

- `public/_redirects` - For Vercel
- `public/404.html` - For GitHub Pages
- `vercel.json` - For Vercel
- `netlify.toml` - For Netlify
- Updated `index.html` - Added GitHub Pages SPA script

## 📋 Deployment Instructions

### GitHub Pages

1. **Update the homepage URL** in `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/credosafe"
   ```
   Replace `yourusername` with your actual GitHub username.

2. **Deploy using the provided script**:
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages`
   - Folder: `/ (root)`

### Vercel

1. **Connect your repository** to Vercel
2. **Deploy automatically** - Vercel will use the `vercel.json` configuration
3. **No additional setup needed** - the configuration handles SPA routing

### Netlify

1. **Connect your repository** to Netlify
2. **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
3. **Deploy** - Netlify will use the `netlify.toml` configuration

## 🔧 Configuration Files Explained

### `public/_redirects` (Vercel)
```
/*    /index.html   200
```
Redirects all routes to index.html with a 200 status code.

### `vercel.json`
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```
Tells Vercel to serve index.html for all routes.

### `public/404.html` (GitHub Pages)
Contains a script that redirects 404s back to the main app with the correct route.

### `index.html` Script
```javascript
(function(l) {
  if (l.search[1] === '/' ) {
    var decoded = l.search.slice(1).split('&').map(function(s) { 
      return s.replace(/~and~/g, '&')
    }).join('?');
    window.history.replaceState(null, null,
        l.pathname.slice(0, -1) + decoded + l.hash
    );
  }
}(window.location))
```
Handles the GitHub Pages redirect and restores the correct URL.

## 🧪 Testing Your Deployment

After deployment, test these URLs to ensure routing works:

- `https://yourdomain.com/` (Landing page)
- `https://yourdomain.com/signin` (Sign in page)
- `https://yourdomain.com/dashboard` (Dashboard)
- `https://yourdomain.com/profile` (Profile page)
- `https://yourdomain.com/transactions` (Transactions page)

All should load without 404 errors.

## 🔄 Troubleshooting

### Still getting 404s?

1. **Clear browser cache** and try again
2. **Check your hosting platform's settings**:
   - GitHub Pages: Ensure you're using the `gh-pages` branch
   - Vercel: Check that `vercel.json` is in the root
   - Netlify: Verify `netlify.toml` is in the root

3. **Verify file locations**:
   - `public/_redirects` should be in the `public` folder
   - `public/404.html` should be in the `public` folder
   - `vercel.json` should be in the root
   - `netlify.toml` should be in the root

### Build Issues?

1. **Update homepage URL** in `package.json` with your correct domain
2. **Run build locally** first: `npm run build`
3. **Check for build errors** in the console

## 📝 Notes

- The configuration files work together to handle different hosting scenarios
- GitHub Pages requires the special 404.html and index.html script
- Vercel and Netlify use their respective configuration files
- All approaches ensure that React Router can handle client-side routing properly

Your app should now work correctly on all major hosting platforms! 🎉 