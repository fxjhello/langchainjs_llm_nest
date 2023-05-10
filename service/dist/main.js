"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./module/app.module");
const dotenv = require("dotenv");
dotenv.config({
    path: '.env'
});
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useGlobalPipes(new common_1.ValidationPipe());
    const directory = './fileProcessing';
    !(process.env.EMBEDDING_SERVER_URL || process.env.CHATGLM_6B_SERVER_URL) && console.error('EMBEDDING_SERVER_URL or CHATGLM_6B_SERVER_URL is not set in .env file');
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map