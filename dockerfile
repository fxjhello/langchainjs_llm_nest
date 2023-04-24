FROM node:18-alpine3.16
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm config set registry https://registry.npm.taobao.org
RUN npm i -g pnpm
RUN pnpm config set registry https://registry.npm.taobao.org
RUN pnpm i
RUN pnpm run build
EXPOSE 3000
CMD ["node", "/usr/src/app/dist/main.js"]