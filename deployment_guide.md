# GhostFrame Production Deployment Guide

Deploying GhostFrame to production requires hosting three separate components and two databases. Because you are running a Node.js API, a React frontend, and a heavy Python AI microservice, it is best to split them across specialized hosting platforms.

Here is the recommended production architecture:

## 1. Databases (Cloud Managed)
Before deploying code, you need your databases running in the cloud.

* **MongoDB**: Use **MongoDB Atlas**. It has a generous free tier. Create a cluster, get your connection string (`mongodb+srv://...`), and whitelist IP access to `0.0.0.0/0` so your server can connect.
* **Redis** (for BullMQ queues): Use **Upstash** or **Redis Enterprise Cloud**. Create a free Redis database and copy the Redis URL (`rediss://...`).

## 2. Frontend (`client/`)
The frontend is a static React/Vite app. It should be hosted on a CDN for maximum global speed.

* **Recommended Platform**: **Vercel** or **Netlify**
* **How to deploy**:
  1. Push your code to a GitHub repository.
  2. Create a new project on Vercel/Netlify and link it to your `client/` folder.
  3. Set the Build Command to `npm run build` and the Output Directory to `dist`.
  4. Add your environment variables (e.g., `VITE_API_URL` pointing to your deployed Node.js backend, and `VITE_SOCKET_URL`).

## 3. Node.js Backend (`server/`)
The backend is a stateful Express server that uses Socket.io and BullMQ. 

* **Recommended Platform**: **Render** (Web Service), **Railway**, or **Heroku**.
* **How to deploy**:
  1. On Render, create a new "Web Service" pointing to the `server/` directory in your GitHub repo.
  2. Set the Start Command to `npm start` (or `node index.js`).
  3. Add your Environment Variables:
     - `MONGO_URI`: Your MongoDB Atlas string.
     - `REDIS_URL`: Your Upstash Redis string.
     - `JWT_SECRET`: A secure random string for signing tokens.
     - `PYTHON_PORT` or `PYTHON_URL`: The URL of your deployed AI service (e.g., `https://ghostframe-ai.onrender.com`).
     - `PORT`: (Provided automatically by the host).

## 4. Python AI Service (`ai-service/`)
This is the most resource-intensive part of the app. Because it uses `rembg` (U-2-Net models), it requires significant RAM and ideally runs via Docker.

* **Recommended Platform**: **Render** (Docker Web Service) or **AWS EC2 / DigitalOcean Droplet**.
* **How to deploy**:
  1. **Create a `Dockerfile`** inside the `ai-service/` folder:
     ```dockerfile
     FROM python:3.9-slim
     WORKDIR /app
     
     # Install system dependencies required for OpenCV/rembg
     RUN apt-get update && apt-get install -y libgl1-mesa-glx libglib2.0-0
     
     COPY requirements.txt .
     RUN pip install --no-cache-dir -r requirements.txt
     
     COPY . .
     EXPOSE 8000
     CMD ["python", "app.py"]
     ```
  2. If using Render, create a new "Web Service", point it to the `ai-service/` folder, and select **Docker** as the environment.
  3. *Note*: The `rembg` model weights download automatically on the first run. In production, this can cause a timeout on the first request. It is often best to pre-download the model in your Dockerfile, or use a machine with at least 2GB-4GB of RAM to prevent memory crashes during extraction.

## Next Steps
1. **Initialize Git**: Run `git init`, commit your code, and push it to a private GitHub repository.
2. **Setup Databases**: Create your Mongo Atlas and Upstash Redis instances.
3. **Deploy**: Deploy the Python service first. Once you have its URL, deploy the Node server (giving it the Python URL). Finally, deploy the React frontend (giving it the Node server URL).
