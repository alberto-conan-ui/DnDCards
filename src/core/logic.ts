import {Suit, Value, ValuedCardModel} from "./model";
import {Card} from "./card";
import {Cards} from "./cards";

type PlayedCardResult = "SUCCESS" | "FIRST_FAILURE" | "NEW_FIRST_FAILURE" | "END_GAME" | "RESET_FROM_HAND"

export class GameManager {
    createInitialDeck (): Cards{
        const suits: Suit[] = ['HEARTS', 'DIAMONDS', 'SPADES', 'CLUBS'];
        const values: Value [] = ['ACE', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'JACK', 'QUEEN', 'KING'];
        const allValuedCards: ValuedCardModel[] = [];
        suits.forEach(suit => {
            values.forEach(value => {
                allValuedCards.push({
                    suit,
                    value
                })
            })
        });
        return new Cards(allValuedCards.map(valuedCard => new Card(valuedCard)));
    }

    playCard(cardToPlay: Card, currentFailure: undefined | Card, fromHand: boolean): PlayedCardResult {
        const thisCardModel = cardToPlay.getModel();
        if (thisCardModel === "JOKER") throw new Error(`there should not be any jokers in the deck`)

        //IF SUCCESS
        if (cardToPlay.isASuccess()) {
            return "SUCCESS";
        }
        //IF THE PLAYER PLAYS A FAILURE FROM HAND
        if (fromHand) {
            return "RESET_FROM_HAND";
        }
        //IF FIRST FAILURE
        if (currentFailure == null) {
            return "FIRST_FAILURE"
        }
        //IF THERE IS A PREVIOUS FAILURE BUT THIS ONE HAS A HIGHER VALUE
        if (cardToPlay.isHigherThanCard(currentFailure)) {
            return "NEW_FIRST_FAILURE"
        }
        //THERE IS A PREVIOUS FAILURE AND THIS ONE IS EQUAL VALUE OR LOWER
        return "END_GAME"
    }

}