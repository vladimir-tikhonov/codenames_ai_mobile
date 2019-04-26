import { observable } from 'mobx';
import { CodeName } from 'src/entities/CodeName';
import { Role } from 'src/entities/Role';
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

    public getWordRole(word: string) {
        const codeNameForWord = this.codeNames.find((codename) => codename.word === word);
        if (!codeNameForWord) {
            throw new Error(`Unknown word: ${word}`);
        }

        return codeNameForWord.role;
    }

    public setWordRole(word: string, newRole: Role) {
        const codeNameForWord = this.codeNames.find((codename) => codename.word === word);
        if (!codeNameForWord) {
            throw new Error(`Unknown word: ${word}`);
        }

        codeNameForWord.role = newRole;
        this.codeNames = [...this.codeNames]; // Trigger state update
    }
}
