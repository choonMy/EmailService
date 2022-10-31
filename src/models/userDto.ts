import { UserEntityType } from './../consts/user';

export type UserDto =
    Pick<UserEntityType, 'id'
        | 'email'
        | 'username'
        | 'role'
        | 'status'>

export type GetUsersOutputDto = UserEntityType