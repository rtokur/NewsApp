import { JwtPayload } from "src/auth/jwt-payload.interface";

declare global {
    namespace Express {
        interface Request {
        user: JwtPayload;
        }
    }
}