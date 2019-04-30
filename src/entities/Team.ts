import { Role } from 'src/entities/Role';

export enum Team {
    Blue,
    Red,
}

export function getFriendlyAgentsRole(team: Team) {
    return team === Team.Blue ? Role.BlueAgent : Role.RedAgent;
}

export function getOpponentAgentsRole(team: Team) {
    return team === Team.Blue ? Role.RedAgent : Role.BlueAgent;
}
