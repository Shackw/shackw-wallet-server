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

# ---- runner
FROM node:lts-alpine AS runner
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
RUN corepack enable && yarn install --immutable --production
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["yarn","start:prod"]