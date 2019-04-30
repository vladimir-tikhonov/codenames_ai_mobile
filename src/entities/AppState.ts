import { observable } from 'mobx';
import { CodeName } from 'src/entities/CodeName';
import { Role } from 'src/entities/Role';
import { Team } from 'src/entities/Team';

interface VisibilityOptions {
    excludeHidden?: boolean;
}

export class AppState {
    @observable public selectedTeam = Team.Blue;
    @observable public enableAi = true;
    @observable public codeNames: CodeName[] = [];
    @observable public hiddenCodeNames: Set<CodeName> = new Set();

    public constructor() {
        const initialWords = [
            'Africa',
            'Agent',
            'Air',
            'Alien',
            'Alps',
            'Amazon',
            'Ambulance',
            'America',
            'Angel',
            'Antarctica',
            'Apple',
            'Arm',
            'Atlantis',
            'Australia',
            'Aztec',
            'Back',
            'Ball',
            'Band',
            'Bank',
            'Bar',
            'Bark',
            'Bat',
            'Battery',
            'Beach',
            'Bear',
            'Beat',
            'Bed',
            'Beijing',
        ];
        initialWords.forEach((w, i) => this.addWordToCodeNames(w, i % 4));
    }

    public addWordToCodeNames(word: string, role?: Role) {
        const wordAlreadyExists = this.codeNames.some((codename) => codename.word === word);
        if (wordAlreadyExists) {
            return;
        }

        this.codeNames.push(new CodeName(word, role));
    }

    public getCodeNamesWithRole(role: Role, customOptions?: VisibilityOptions) {
        const options = { excludeHidden: false, ...customOptions };

        const codeNamesWithRole = this.codeNames.filter((codeName) => codeName.role === role);
        if (options.excludeHidden) {
            return codeNamesWithRole.filter((codeName) => !this.hiddenCodeNames.has(codeName));
        }

        return codeNamesWithRole;
    }

    public removeCodeName(codeNameToRemove: CodeName) {
        this.codeNames = this.codeNames.filter((codename) => codename !== codeNameToRemove);
        this.hiddenCodeNames.delete(codeNameToRemove);
    }

    public setCodeNameRole(codeName: CodeName, newRole: Role) {
        codeName.role = newRole;
        this.codeNames = [...this.codeNames]; // Trigger state update
    }

    public toggleCodeNameVisibility(codeName: CodeName) {
        this.hiddenCodeNames.has(codeName) ? this.showCodeName(codeName) : this.hideCodeName(codeName);
    }

    public hideCodeName(codeName: CodeName) {
        this.hiddenCodeNames.add(codeName);
    }

    public showCodeName(codeName: CodeName) {
        this.hiddenCodeNames.delete(codeName);
    }

    public getHiddenCodeNames() {
        return [...this.hiddenCodeNames];
    }
}
