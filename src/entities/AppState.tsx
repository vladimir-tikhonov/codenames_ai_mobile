import { observable } from 'mobx';
import { Team } from 'src/entities/Team';

export class AppState {
    @observable public selectedTeam = Team.Blue;
    @observable public enableAi = true;
}
