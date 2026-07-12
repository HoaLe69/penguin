# multi stage build to reduce the image size

# Statge 1 : build react

#FROM node:18-alpine AS builder
FROM node:22-alpine AS builder
#ENV NODE_VERSION=22.23.1
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# statge 2 : Nginx for serving static files from build
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
