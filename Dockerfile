# 构建阶段
FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g pnpm@10.32.1

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# 构建时写入接口地址，需能从浏览器直接访问（如 http://192.168.5.189:8282/netdisk）
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm build

# 运行阶段
FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80