declare const app: import("@types/express-serve-static-core").Express;
export declare const handler: (event: any, context: any) => Promise<{
    statusCode: number;
    body: string;
}>;
export default app;
