FROM node:12-alpine

RUN apk --no-cache --update -q add tini

WORKDIR /opt/demo
COPY package*json ./

RUN chown node:root /opt/demo && npm ci

COPY etc etc
COPY lib lib

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "lib"]
