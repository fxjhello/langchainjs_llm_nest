FROM node:18
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app
# python
RUN wget https://mirrors.huaweicloud.com/python/3.8.10/Python-3.8.10.tgz
RUN tar -xzvf Python-3.8.10.tgz
RUN mkdir /usr/local/python3 
RUN /usr/src/app/Python-3.8.10/configure --prefix=/usr/local/python3
RUN make && make install
RUN ln -s /usr/local/python3/bin/python3  /usr/bin/python
RUN npm config set registry
RUN npm i -g pnpm
RUN pnpm config set registry
RUN pnpm i

EXPOSE 3000
CMD ["pnpm", "start"]