# Highview Landing Page

Single-page static landing site for `highview.us`.

## Local preview

```bash
cd /Users/kup/Desktop/highview-landing
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Formspree setup

1. Create a form at [Formspree](https://formspree.io/).
2. Copy your form endpoint (looks like `https://formspree.io/f/xxxxxx`).
3. Replace the `action` URL in `index.html`.

## Deploy to GitHub Pages

1. Create a new GitHub repo (for example `highview-landing`).
2. Push this folder to the repo.
3. In GitHub repo settings:
   - `Settings` -> `Pages`
   - Source: `Deploy from a branch`
   - Branch: `main` and `/ (root)`
4. Confirm `CNAME` contains:
   - `highview.us`

## GoDaddy DNS

Add/confirm these DNS records:

- `A` record: host `@`, value `185.199.108.153`
- `A` record: host `@`, value `185.199.109.153`
- `A` record: host `@`, value `185.199.110.153`
- `A` record: host `@`, value `185.199.111.153`
- `CNAME` record: host `www`, value `<your-github-username>.github.io`

After DNS propagates, in GitHub Pages enable HTTPS.
