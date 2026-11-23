# 构建阶段
FROM node:22-alpine AS build
WORKDIR /app

RUN npm install -g pnpm@10.32.1

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# 前端默认访问同源 /netdisk，由外部网关或部署层负责路由。
ARG VITE_API_BASE_URL=/netdisk
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN pnpm build

# 运行阶段
FROM nginx:1.27-alpine

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
