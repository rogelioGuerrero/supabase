import { Request, Response } from 'express';
export declare const createProducto: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const getProductos: (req: Request, res: Response) => Promise<void>;
export declare const getProductoById: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const updateProducto: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const deleteProducto: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
