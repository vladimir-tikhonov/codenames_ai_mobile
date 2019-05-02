import { apiHost } from 'config/appConfig';
import { Association } from 'src/entities/Association';
import { CodeName } from 'src/entities/CodeName';
import { Role } from 'src/entities/Role';
import { getFriendlyAgentsRole, getOpponentAgentsRole, Team } from 'src/entities/Team';

export async function loadAssociations(codeNames: CodeName[], myTeam: Team) {
    const friendlyAgentsRole = getFriendlyAgentsRole(myTeam);
    const opponentAgentsRole = getOpponentAgentsRole(myTeam);

    const request = {
        myAgents: getWordsWithRole(codeNames, friendlyAgentsRole),
        assassins: getWordsWithRole(codeNames, Role.Assasin),
        opponentAgents: getWordsWithRole(codeNames, opponentAgentsRole),
        bystanders: getWordsWithRole(codeNames, Role.Bystander),
        lang: 'ru',
    };

    const rawResponse = await fetch(`${apiHost}/api/associations`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });
    const response = await rawResponse.json();
    if (rawResponse.status !== 200) {
        throw new Error(response.errorMessage);
    }
    return response.associations as Association[];
}

function getWordsWithRole(codeNames: CodeName[], role: Role) {
    return codeNames.filter((codeName) => codeName.role === role).map((codeName) => codeName.word);
}
