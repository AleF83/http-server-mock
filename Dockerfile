FROM node:lts-buster-slim AS base

FROM base AS dependencies
WORKDIR /service
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile --production true

FROM base AS build
WORKDIR /service
COPY package.json yarn.lock ./
RUN yarn --pure-lockfile --production false
COPY tsconfig.json tsconfig.build.json .jestrc.json ./
COPY src ./src
RUN yarn test:unit
RUN yarn build

FROM base AS release
WORKDIR /service
COPY --from=dependencies /service/node_modules ./node_modules
COPY --from=build /service/dist ./dist
COPY package.json ./

ENV NODE_ENV=production

CMD [ "yarn", "start" ]

