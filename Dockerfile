# ---- deps
FROM node:lts-alpine AS deps
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable

# ---- build
FROM node:lts-alpine AS build
WORKDIR /app
COPY --from=deps /app/ ./
COPY . .
RUN yarn build

# ---- run
FROM node:lts-alpine AS runner
WORKDIR /app
USER node
COPY --from=build --chown=node:node /app/package.json ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/dist ./dist

EXPOSE 3000
CMD ["yarn","start:prod"]