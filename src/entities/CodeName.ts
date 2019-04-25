import { Role } from 'src/entities/Role';

export class CodeName {
    public constructor(public word: string, public role = Role.Bystander) {}
}
