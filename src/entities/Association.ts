export interface Association {
    associationWord: string;
    associatedWords: string[];
    rivalWords: string[];
    rivalWordScores: number[];
    overallScore: number;
    guessableScore: number;
    confusionScore: number;
}
