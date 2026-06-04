# Stage 1: Build
FROM node:20.18.0-slim AS builder

WORKDIR /var/www/frontent-v5/

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:20.18.0-slim

WORKDIR /var/www/frontent-v5/

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=3001

COPY --from=builder /var/www/frontent-v5/.output .output
COPY --from=builder /var/www/frontent-v5/node_modules ./node_modules

EXPOSE 3001

CMD ["node", ".output/server/index.mjs"]

