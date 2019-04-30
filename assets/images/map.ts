import { Role } from 'src/entities/Role';

export const roleImages = {
    [Role.RedAgent]: require('assets/images/red.png'),
    [Role.BlueAgent]: require('assets/images/blue.png'),
    [Role.Bystander]: require('assets/images/bystander.png'),
    [Role.Assasin]: require('assets/images/assasin.png'),
};
