FROM node:18 as build

WORKDIR /app

copy . .

run npm install

run npm run build --prod

from nginx:alpine

copy --from=build /app/dist/chat-app/browser /usr/share/nginx/html

expose 80
