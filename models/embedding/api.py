from fastapi import FastAPI, Request
from langchain.embeddings.huggingface import HuggingFaceEmbeddings

from transformers import AutoTokenizer, AutoModel
import uvicorn
import json
import datetime
import torch

DEVICE = "cuda"
DEVICE_ID = "0"
CUDA_DEVICE = f"{DEVICE}:{DEVICE_ID}" if DEVICE_ID else DEVICE


def torch_gc():
    if torch.cuda.is_available():
        with torch.cuda.device(CUDA_DEVICE):
            torch.cuda.empty_cache()
            torch.cuda.ipc_collect()


app = FastAPI()


# @app.post("/")
# async def create_item(request: Request):
#     global model, tokenizer
#     json_post_raw = await request.json()
#     json_post = json.dumps(json_post_raw)
#     json_post_list = json.loads(json_post)
#     prompt = json_post_list.get('prompt')
#     history = json_post_list.get('history')
#     max_length = json_post_list.get('max_length')
#     top_p = json_post_list.get('top_p')
#     temperature = json_post_list.get('temperature')
#     response, history = model.chat(tokenizer,
#                                    prompt,
#                                    history=history,
#                                    max_length=max_length if max_length else 2048,
#                                    top_p=top_p if top_p else 0.7,
#                                    temperature=temperature if temperature else 0.95)
#     now = datetime.datetime.now()
#     time = now.strftime("%Y-%m-%d %H:%M:%S")
#     answer = {
#         "response": response,
#         "history": history,
#         "status": 200,
#         "time": time
#     }
#     log = "[" + time + "] " + '", prompt:"' + prompt + '", response:"' + repr(response) + '"'
#     print(log)
#     torch_gc()
#     return answer

@app.post("/embedDocuments")
async def embed_documents(request: Request):
    global embeddings
    json_post_raw = await request.json()
    json_post = json.dumps(json_post_raw)
    json_post_list = json.loads(json_post)
    documents = json_post_list.get('documents')
    doc_result = embeddings.embed_documents(documents)
    torch_gc()
    return doc_result


@app.post("/embedQuery")
async def embed_query(request: Request):
    global embeddings
    json_post_raw = await request.json()
    json_post = json.dumps(json_post_raw)
    json_post_list = json.loads(json_post)
    document = json_post_list.get('document')
    query_result = embeddings.embed_query(document)
    torch_gc()
    return query_result


if __name__ == '__main__':
    # tokenizer = AutoTokenizer.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True)
    # model = AutoModel.from_pretrained("THUDM/chatglm-6b", trust_remote_code=True).half().cuda()
    # model.eval()
    embeddings = HuggingFaceEmbeddings(
        model_name='GanymedeNil/text2vec-large-chinese', )
    # embeddings.client = sentence_transformers.SentenceTransformer(embeddings.model_name,
    #                                                               device=embedding_device)
    uvicorn.run(app, host='0.0.0.0', port=56391, workers=1)
