FROM node:13.12.0-alpine as builder

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./

RUN npm ci --silent
RUN npm install react-scripts@3.4.1 -g --silent

COPY . ./
RUN npm run build

##### NGINX build #####
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d
RUN rm /etc/nginx/conf.d/default.conf
RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

