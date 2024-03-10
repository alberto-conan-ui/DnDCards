import {GameSession, GameSessionResult} from "./gameSession";

export interface GameSessionRunningResult {
    resettingFrom: number;
    stoppingAt: number;
    cardsToDraw: number;
    sessionsToRun: number;
    results: GameSessionResult[];
    averageScore: number,
    deviation: number,
    maxScore: number,
    avgCardsCount: number,
    maxNumberOfGambles: number,
}

export class GameSessionRunner {

    run(sessionsToRun: number, cardsToDraw: number, resettingFrom: number, stoppingAt: number, maxNumberOfGambles: number): GameSessionRunningResult {
        const results: GameSessionResult[] = [];

        for (let i = 0; i < sessionsToRun; i++) {
            const session = new GameSession();
            const result = session.play(cardsToDraw, resettingFrom, stoppingAt, maxNumberOfGambles);
            results.push(result);
        }

        //gather statistics from gameSessionResults including deviation
        const scores = results.map(result => result.score);
        const averageScore = scores.reduce((total, score) => total + score, 0) / scores.length;

        //calculate deviation
        const deviation = Math.sqrt(scores.reduce((total, score) => total + Math.pow(score - averageScore, 2), 0) / scores.length);

        //calculate max scpre
        const maxScore = Math.max(...scores);

        //calculate average count of cards inside the results
        const avgCardsCount = results.reduce((total, result) => total + result.playedCards.length, 0) / results.length;





        return {
            cardsToDraw,
            results,
            resettingFrom,
            stoppingAt,
            sessionsToRun,
            averageScore,
            deviation,
            maxScore,
            avgCardsCount,
            maxNumberOfGambles
        };
    }
}