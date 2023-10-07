FROM node:18.17.0

WORKDIR /usr/src/api

COPY . .

COPY ./.env.production ./.env

RUN yarn --silent --no-optional --no-fund --log-level=error

RUN yarn build

EXPOSE 3000

CMD ["yarn", "start:prod"]