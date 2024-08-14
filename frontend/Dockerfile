FROM node:14.5-alpine as react-build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM node:14.5-alpine as server-build
WORKDIR /root/
COPY --from=react-build /usr/src/app/build ./build
COPY node_server/package*.json ./node_server/
RUN cd node_server && npm install
COPY node_server/server.js ./node_server/

EXPOSE 80

CMD ["node", "./node_server/server.js"]