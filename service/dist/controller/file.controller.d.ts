import { FileService } from 'src/service/file.service';
export declare class FileController {
    private readonly fileService;
    constructor(fileService: FileService);
    queryFileList(): Promise<string[]>;
    deleteFile(body: any): Promise<void>;
}
