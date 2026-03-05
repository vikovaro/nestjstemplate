import { TRole } from '../../../common/types/role.type';

export class AuthUser {
    id: string;
    username: string;
    email: string;
    phone: string;
    role: TRole;
    createdAt: Date;
    password: string;
}
