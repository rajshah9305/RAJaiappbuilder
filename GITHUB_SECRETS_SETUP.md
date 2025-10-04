# 🔐 GitHub Secrets Setup for Neon Integration

## Required Secrets & Variables

### 1. Repository Variables
Go to: **GitHub Repo → Settings → Secrets and variables → Actions → Variables**

Add:
```
Name: NEON_PROJECT_ID
Value: red-cloud-21047203
```

### 2. Repository Secrets
Go to: **GitHub Repo → Settings → Secrets and variables → Actions → Secrets**

Add:
```
Name: NEON_API_KEY
Value: [Get from Neon Dashboard → Account Settings → API Keys]
```

## 🔑 Get Your Neon API Key

1. Go to https://console.neon.tech/app/settings/api-keys
2. Click **Generate new API key**
3. Name it: `GitHub Actions`
4. Copy the key (starts with `neon_api_`)
5. Add to GitHub Secrets as `NEON_API_KEY`

## ✅ What This Does

- **On PR Open**: Creates temporary Neon database branch
- **On PR Update**: Updates the branch
- **On PR Close**: Deletes the branch (auto-cleanup)
- **Runs Migrations**: Automatically applies Prisma schema

## 🚀 Test It

1. Create a new branch: `git checkout -b test-neon`
2. Make a change and push
3. Open a pull request
4. Check Actions tab for workflow run
5. Neon branch will be created automatically

## 📋 Quick Setup Checklist

- [ ] Add `NEON_PROJECT_ID` variable (red-cloud-21047203)
- [ ] Generate Neon API key
- [ ] Add `NEON_API_KEY` secret
- [ ] Commit workflow file
- [ ] Test with a PR
