import { observable } from 'mobx';
import { CodeName } from 'src/entities/CodeName';
import { Team } from 'src/entities/Team';

export class AppState {
    @observable public selectedTeam = Team.Blue;
    @observable public enableAi = true;
    @observable public codeNames: CodeName[] = [];

    public addWordToCodeNames(word: string) {
        const wordAlreadyExists = this.codeNames.some((codename) => codename.word === word);
        if (wordAlreadyExists) {
            return;
        }

        this.codeNames.push(new CodeName(word));
    }

    public removeWordFromCodeNames(word: string) {
        this.codeNames = this.codeNames.filter((codename) => codename.word !== word);
    }
}
