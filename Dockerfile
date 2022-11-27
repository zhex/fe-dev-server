FROM node:18 as builder

WORKDIR /code

RUN npm i pnpm -g

COPY . .

RUN pnpm i

#----

FROM node:18-alpine

WORKDIR /code/fe-dev-server

COPY --from=builder /code ./

RUN npm link .

CMD [ "fds", "server" ]
