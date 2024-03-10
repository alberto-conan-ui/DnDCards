import {Cards} from "./cards";
import {GameManager} from "./logic";
import {Card} from "./card";

type Result = "SUCCESS" | "FIRST_FAILURE" | "NEW_FIRST_FAILURE" | "END_GAME" | "RESET_FROM_HAND";

export interface PlayedCard {
    card: Card,
    source: 'hand' | 'deck',
    result: Result,
    gamblesTaken: number,
}
export type GameSessionResult = {
    playedCards: PlayedCard[];
    score: number;
}

export class GameSession {
    play(cardsToDraw: number, resettingFrom: number, stoppingAt: number, maxNumberOfGambles: number): GameSessionResult {
        const gameManager = new GameManager();
        const deck = gameManager.createInitialDeck().shuffle();
        const drawnCards  = new Cards(deck.draw(cardsToDraw)).sortByValue();

        let gameIsActive = true;
        let score=0;
        const playedCards: PlayedCard[] = [];
        let currentFailure: Card | undefined = undefined;
        let gamblesTaken: number = 0;
        let previousResult: Result | undefined = undefined;

        while (gameIsActive){
            let checkForRisk: boolean = false;
            let fromHand: boolean = true;
            let cardToPlay: Card | undefined;
            if (currentFailure != null && drawnCards.asArray().length > 0){
                const mostValuedCard = drawnCards.sortByValue().peekFirst();
                if (mostValuedCard.isASuccess()){
                    cardToPlay = drawnCards.drawOne();
                } else {
                    const lessValuedCard = drawnCards.peekLast();
                    if (lessValuedCard.isLowerThanOrEquals(resettingFrom) && lessValuedCard.isLowerThanCard(currentFailure)){
                        drawnCards.reverse();
                        cardToPlay = drawnCards.drawOne();
                        drawnCards.reverse();
                    } else{
                        checkForRisk = true;
                    }
                }
            } else {
                checkForRisk = true;
            }

            if (checkForRisk){
                if (currentFailure!=null && currentFailure.isHigherThanOrEquals(stoppingAt) && score > 0){
                    if (gamblesTaken >= maxNumberOfGambles && score > 0) {
                        gameIsActive = false;
                        break;
                    } else {
                        gamblesTaken ++;
                    }
                }
                if (previousResult === "NEW_FIRST_FAILURE" && gamblesTaken === maxNumberOfGambles && score > 0){
                    if (gamblesTaken >= maxNumberOfGambles) {
                        gameIsActive = false;
                        break;
                    } else {
                        gamblesTaken ++;
                    }
                }
                fromHand = false;
                cardToPlay = deck.drawOne();
            }

            if (cardToPlay == null){
                gameIsActive = false;
                break;
            }

            const result: Result = gameManager.playCard(cardToPlay, currentFailure, fromHand);


            playedCards.push({
                card: cardToPlay,
                source: fromHand ? "hand": "deck",
                result,
                gamblesTaken
            });
            switch (result) {
                case "END_GAME":{
                    score = 0;
                    currentFailure = cardToPlay;
                    gameIsActive = false;
                    break;
                }
                case "SUCCESS":{
                    score ++;
                    currentFailure = undefined;
                    break;
                }
                case "NEW_FIRST_FAILURE":
                case "RESET_FROM_HAND":
                case "FIRST_FAILURE":{
                    currentFailure = cardToPlay;
                    break;
                }
            }

            previousResult = result;


        }

        return {
            score,
            playedCards
        }
    }
}