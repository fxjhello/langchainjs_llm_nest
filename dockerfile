# Python3.7官网镜像
FROM python:3.8

# 设置工作目录
WORKDIR /app

# 复制当前目录下的文件到工作目录
COPY . /app

# 安装pip库
RUN pip install -r requirements.txt -i https://pypi.douban.com/simple/ &&\
  wget https://nodejs.org/dist/v18.16.0/node-v18.16.0.tar.gz &&\
  tar -zxvf node-v18.16.0.tar.gz -C /opt/
ENV PATH=$PATH:/opt/node-v18.16.0/bin

RUN npm config set registry https://registry.npm.taobao.org
RUN npm i -g pnpm
RUN pnpm config set registry https://registry.npm.taobao.org
RUN pnpm i
RUN pnpm run build
EXPOSE 3000
CMD ["node", "/usr/src/app/dist/main.js"]