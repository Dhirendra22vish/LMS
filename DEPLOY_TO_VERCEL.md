---
description: Deploying MERN App to Vercel
---

# Deploying to Vercel

The project is fully configured for Vercel deployment. Since you already have a MongoDB Atlas URI, the process is straightforward.

## 1. Install Vercel CLI
If you haven't already:
```powershell
npm install -g vercel
```

## 2. Deploy
Run the following command from the project root (`c:\Users\DELL\Desktop\pph`):
```powershell
vercel
```

## 3. Configuration Steps (during `vercel` command)
*   **Set up and deploy?** [Y]es
*   **Which scope?** [Select your account]
*   **Link to existing project?** [N]o
*   **Project Name**: [Press Enter to use default]
*   **In which directory is your code located?** `./` (Press Enter)
*   **Want to modify these settings?** [N]o

## 4. Add Environment Variables
After the deployment starts (or finishes), go to your Vercel Project Dashboard > Settings > Environment Variables and add:
*   `MONGO_URI`: `mongodb+srv://dhiru7521071887_db_user:zWU3jZgINp5aOgKM@cluster0.qomxmyl.mongodb.net/?appName=Cluster0`
*   `JWT_SECRET`: `supersecretkey123`

## 5. Redeploy
If the first deployment failed because variables were missing from the dashboard, run:
```powershell
vercel --prod
```

Your app will be live!
