import {Card} from "./card";
import {ValuedCardModel} from "./model";

export class Cards {
    constructor(
        private readonly cards: Card[]
    ) {
    }

    asArray(): Card[] {
        return this.cards.map(it => new Card(it.getModel()));
    }

    private doShuffledCards(): Card[] {
        let array = [...this.cards]; // Create a new array that is a copy of cards
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }


    shuffle(): Cards {
        return new Cards(this.doShuffledCards());
    }

    draw(cardsToDraw: number): Card[] {
        const result: Card[] = [];
        for (let i = 0; i < cardsToDraw; i++) {
            result.push(this.drawOne());
        }
        return result;
    }

    drawOne(): Card {
        if (this.cards.length === 0) throw new Error(`can't draw cards when there is no cards left to draw`);
        return this.cards.shift()!;
    }

    sortByValue(): Cards {
        this.cards.sort((a, b) => {
            const aValue = (a.getModel() as ValuedCardModel).value;
            const bValue = (b.getModel() as ValuedCardModel).value;
            if (isNaN(Number(aValue))) return -1;
            if (isNaN(Number(bValue))) return 1;

            if (aValue < bValue) {
                return 1;
            }
            if (aValue > bValue) {
                return -1;
            }
            return 0;
        });
        return this;
    }

    reverse (): Cards {
        this.cards.reverse();
        return this;
    }

    peekFirst(): Card {
        return this.cards[0];
    }

    peekLast(): Card{
        return this.cards[this.cards.length - 1];
    }
}