import { observable } from 'mobx';
import { Association } from 'src/entities/Association';
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
    @observable public associationsWereLoaded = false;
    @observable public associations: Association[] = [];

    public constructor() {
        const initialWords = [
            'Австралия',
            'Автобус',
            'Автомобиль',
            'Аист',
            'Акция',
            'Аладдин',
            'Америка',
            'Англия',
            'Апельсин',
            'Арктика',
            'Африка',
            'Баба-яга',
            'Банан',
            'Банк',
            'Баран',
            'Бассейн',
            'Батарея',
            'Белок',
            'Берег',
            'Биатлон',
            'Блок',
            'Боб',
            'Богатырь',
            'Бокс',
            'Брак',
        ];
        initialWords.forEach((w, i) => this.addWordToCodeNames(w, i % 4));
    }

    public addWordToCodeNames(word: string, role?: Role) {
        const wordAlreadyExists = this.codeNames.some((codename) => codename.word === word);
        if (wordAlreadyExists) {
            return;
        }

        this.codeNames.push(new CodeName(word, role));
        this.resetAssociations();
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
        this.resetAssociations();
    }

    public setCodeNameRole(codeName: CodeName, newRole: Role) {
        codeName.role = newRole;
        this.codeNames = [...this.codeNames]; // Trigger state update
        this.resetAssociations();
    }

    public toggleCodeNameVisibility(codeName: CodeName) {
        this.hiddenCodeNames.has(codeName) ? this.showCodeName(codeName) : this.hideCodeName(codeName);
    }

    public hideCodeName(codeName: CodeName) {
        this.hiddenCodeNames.add(codeName);
        this.resetAssociations();
    }

    public showCodeName(codeName: CodeName) {
        this.hiddenCodeNames.delete(codeName);
        this.resetAssociations();
    }

    public getVisibleCodeNames() {
        return this.codeNames.filter((codeName) => !this.hiddenCodeNames.has(codeName));
    }

    public getHiddenCodeNames() {
        return [...this.hiddenCodeNames];
    }

    public setAssociations(associations: Association[]) {
        this.associations = associations;
        this.associationsWereLoaded = true;
    }

    public getCodeNameByWord(word: string) {
        const matchingCodeName = this.codeNames.find((codeName) => codeName.word.toLowerCase() === word.toLowerCase());
        if (!matchingCodeName) {
            throw new Error(`Unknown word: ${word}`);
        }

        return matchingCodeName;
    }

    private resetAssociations() {
        this.associationsWereLoaded = false;
        this.associations = [];
    }
}
