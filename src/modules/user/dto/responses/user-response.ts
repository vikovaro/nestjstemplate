import { ApiProperty } from '@nestjs/swagger';
import type { TRole } from '../../../../common/types/role.type'; // Используем import type

export class UserResponse {
    @ApiProperty({
        example: 'b2a53186-46a9-46aa-bd40-d33dbc301b83',
    })
    id: string;

    @ApiProperty({
        example: 'admin',
    })
    username: string;

    @ApiProperty({
        example: 'user@example.com',
    })
    email: string;

    @ApiProperty({
        example: '+79991234567',
    })
    phone: string;

    @ApiProperty({
        enum: ['User', 'Admin'],
        example: 'User',
        description: 'Роль пользователя',
    })
    role: TRole;

    @ApiProperty({
        example: '2024-01-15T10:30:00Z',
    })
    createdAt: Date;
}
