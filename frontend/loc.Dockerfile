FROM node:14.5-alpine as build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

#===dev====
EXPOSE 3000
CMD ["npm", "start"]

#===prod===
#COPY . ./
#RUN npm run build

#FROM nginx:stable-alpine
#COPY --from=build /usr/src/app/build /usr/share/nginx/html
#COPY --from=build /usr/src/app/nginx.conf /etc/nginx/conf.d/default.conf
#EXPOSE 80
#CMD ["nginx", "-g", "daemon off;"]