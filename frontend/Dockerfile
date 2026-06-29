FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
# Copy built files
COPY --from=build /app/dist /usr/share/nginx/html
# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
