"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./module/app.module");
const myVectorStore_1 = require("./vector_store/myVectorStore");
const text2vec_large_chinese_embedding_1 = require("./embeddings/text2vec-large-chinese.embedding");
const dotenv = require("dotenv");
dotenv.config({
    path: '.env'
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.enableCors();
    const directory = './fileProcessing';
    myVectorStore_1.MyVectorStore.getInstance(directory, new text2vec_large_chinese_embedding_1.T2VLargeChineseEmbeddings());
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map