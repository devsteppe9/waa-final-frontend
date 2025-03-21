# Stage 1: Build the application
FROM node:20 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN VITE_API_BASE_URL=http://52.90.131.91/waa-backend/api/v1 npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
