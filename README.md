# 基于nest.js-langchain的本地知识的 LLM 应用

## 介绍

本项目旨在构建一个：模型层(models)-服务层(service)-展示层(views) 三层完全解耦的、支持二次开发、分开部署的、LLM落地框架。

模型层：使用Python 3。采用Transformers加载模型，并采用Fastapi将所有接口api化。
后续计划：
用OPenai api的格式统一封装所有本地模型。
将模型层制作成sdk并独立仓库，进一步降低部署难度。       
计划参考：https://github.com/ninehills/chatglm-openai-api

服务层：使用JS。采用Langchain.js+nest.js框架，实现业务逻辑开发与数据处理，提高与拓展模型层的性能。
后续计划:
结合实际落地痛点，不断升级应用层。
参考项目：https://github.com/imClumsyPanda/langchain-ChatGLM

展示层: 使用JS。采用vue3全家桶+native-ui,展示本项目的成果。
后续计划：
不断跟进应用层的升级，同时提高页面的美观程度和交互体验。
参考项目：https://github.com/Chanzhaoyu/chatgpt-web

## 未来展望
本项目的阶段性目标，是提供 LLM封装->本地知识库搭建->商业化部署->用户反馈收集(前端埋点，数据清洗等)->模型专业领域微调(使用上一个阶段收集的数据集)->LLM封装
这样的LLM专业领域落地闭环解决方案

## 欢迎加入
如果你对以上三层的任一层或未来展望感兴趣，欢迎加入我们！


## 项目原理

⛓️ 本项目实现原理如下图来自(https://github.com/imClumsyPanda/langchain-ChatGLM/tree/master) 所示，过程包括加载文件 -> 读取文本 -> 文本分割 -> 文本向量化 -> 问句向量化 -> 在文本向量中匹配出与问句向量最相似的`top k`个 -> 匹配出的文本作为上下文和问题一起添加到`prompt`中 -> 提交给`LLM`生成回答。

![实现原理图](img/langchain+chatglm.png)

## 变更日志

2023.4.27 项目正式发布v0.1.0

2023.5.7 项目完成初步设计v0.2.0

## 硬件需求

- ChatGLM-6B 模型硬件需求
  
    | **量化等级**   | **最低 GPU 显存**（推理） | **最低 GPU 显存**（高效参数微调） |
    | -------------- | ------------------------- | --------------------------------- |
    | FP16（无量化） | 13 GB                     | 14 GB                             |
    | INT8           | 8 GB                     | 9 GB                             |
    | INT4           | 6 GB                      | 7 GB                              |

- Embedding 模型硬件需求

    本项目选用的 Embedding 模型 [GanymedeNil/text2vec-large-chinese](https://huggingface.co/GanymedeNil/text2vec-large-chinese/tree/main) 约占用显存 3GB，也可修改为在 CPU 中运行。


## 开发部署

### 软件需求

Node18,Python 3

### 如果本地已有模型：从本地加载模型

请参考 [THUDM/ChatGLM-6B#从本地加载模型](https://github.com/THUDM/ChatGLM-6B#从本地加载模型)

### 服务层(service)
cd service
安装依赖并启动
- 项目下载\
- 安装依赖
  - 开发环境得要有python环境(我的是python3.9.10)，用于支持vector_store里使用的hnswlib库
  - visual studio 里安装c++环境
  - javascript\
    `cd langchain_chatglm_nest`
    - yarn # 二选一
    - pnpm i # 二选一
    - [x] 不推荐npm
- 运行
  - yarn start:dev # 二选一
  - pnpm start:dev # 二选一
- 配置
  - .env\
    `在项目的根目录下，设置.env，EMBEDDING_SERVER_URL为embedding的ip地址,CHATGLM_6B_SERVER_URL为chatGLM-6B的ip地址`
    
### 模型层(models)    
cd models

 - chatGLM-6B\
    `cd ChatGLM-6B`
    - pip install -r requirements.txt #建议走国内pip镜像源，比较快
    - python api.py
    
  - embedding\
    `cd ../embedding`
    - python api.py # 依赖讲道理都可以在chatGLM-6B的依赖里

### 前端(views)
cd views

pnpm i

npm run dev

### docker部署
- 1. \
  ```git clone https://github.com/fxjhello/langchain_chatglm_nest.git```
- 2. \
  ```cd langchain_chatglm_nest```
- 3. \
  ```docker build -t langchain_chatglm_nest:v1.0.0 -f ./dockerfile . # 打包```
- 4. \
  ```docker run -d --restart=always --name langchain_chatglm_nest-main  -p  51798:3000  langchain_chatglm_nest-main:1.0.0 #左边的端口随便取```
### 提问
- issues
- 微信群\
  欢迎大家提问，我们会补充文档和优化的
## 鸣谢
本项目的原理图，实现思路，以及Embedding 模型py封装，均来自(https://github.com/imClumsyPanda/langchain-ChatGLM/tree/master)

## 路线图

- [ ] Langchain 应用
  - [x] 支持多种文档格式（已支持 pdf、docx、txt 文件格式）
  - [ ] 搜索引擎与本地网页接入
  - [ ] 结构化数据接入（如 csv、Excel、SQL 等）
  - [ ] 知识图谱/图数据库接入
  - [ ] 更多功能 实现
- [ ] 增加更多 LLM 模型支持
  - [x] [THUDM/chatglm-6b](https://huggingface.co/THUDM/chatglm-6b)
- [ ] 增加更多 Embedding 模型支持
  - [x] [GanymedeNil/text2vec-large-chinese](https://huggingface.co/GanymedeNil/text2vec-large-chinese)
- [ ] 前端
  - [x] 增加前端展示界面

## 项目交流群
![二维码](img/qr_code_8.png)

🎉 langchain-nest.js 项目交流群，如果你也对本项目感兴趣，欢迎加入群聊参与讨论交流。
