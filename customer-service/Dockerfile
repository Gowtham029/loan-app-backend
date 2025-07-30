FROM node:24-alpine

RUN npm install -g pnpm

WORKDIR /app

COPY package*.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY ../proto ./proto
COPY . .
RUN pnpm run build

EXPOSE 50052

CMD ["pnpm", "run", "start:prod"]