import { Request, Response } from 'express';
export interface GenericModel {
    id?: number | string;
    [key: string]: any;
}
export declare class GenericController<T extends GenericModel> {
    private supabase;
    private tableName;
    constructor(tableName: string);
    handleAction(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    private create;
    private update;
    private delete;
    private list;
    private getById;
}
