import {CardModel, ValuedCardModel} from "./model";

export class Card {
    constructor(
        private readonly cardModel: CardModel
    ) {
    }

    toString(): string {
        if (typeof this.cardModel === 'string') {
            return this.cardModel
        }

        return `${this.cardModel.value} of ${this.cardModel.suit}`
    }

    getModel(): CardModel {
        if (typeof this.cardModel === "string") return this.cardModel;
        return {...this.cardModel}
    }

    isASuccess(): boolean {
        if (this.cardModel === 'JOKER') return true;
        return (this.cardModel.value === 'ACE') ||
            (this.cardModel.value === 'KING') ||
            (this.cardModel.value === 'QUEEN') ||
            (this.cardModel.value === 'JACK');
    }

    compareWith(number: number): -1 | 0 | 1 {
        if (this.cardModel === 'JOKER') throw new Error(`JOKER not expected`);
        const thisValue = (this.cardModel as ValuedCardModel).value;
        const asNumber = Number(thisValue);
        if (isNaN(asNumber)) return -1;
        return asNumber > number ? 1 : asNumber === number ? 0 : -1;
    }

    isHigherThan(riskToTake: number): boolean {
        return this.compareWith(riskToTake) === 1;
    }

    isHigherThanOrEquals(riskToTake: number): boolean {
        return this.isHigherThan(riskToTake) || this.isEquals(riskToTake);
    }

    isEquals(riskToTake: number): boolean {
        return this.compareWith(riskToTake) === 0;
    }


    compareWithCard(currentFailure: Card): -1 | 0 | 1 {
        if (this.cardModel === 'JOKER') throw new Error(`JOKER not expected`);
        if (currentFailure.getModel() === 'JOKER') throw new Error(`JOKER not expected`);
        const thisValue = Number(this.cardModel.value);
        const otherValue = Number((currentFailure.getModel() as ValuedCardModel).value);
        if (isNaN(thisValue) && isNaN(otherValue)) return 0;
        if (isNaN(thisValue)) return -1;
        if (isNaN(otherValue)) return 1;
        return this.compareWith(otherValue);


    }

    isLowerThanCard(currentFailure: Card) {
        return this.compareWithCard(currentFailure) === -1;
    }

    isEqualsToCard(currentFailure: Card) {
        return this.compareWithCard(currentFailure) === 0;
    }

    isHigherThanCard(currentFailure: Card) {
        return this.compareWithCard(currentFailure) === 1;
    }
    isLowerOrEqualsThanCard(currentFailure: Card) {
        return this.isLowerThanCard(currentFailure) || this.isEqualsToCard(currentFailure);
    }

    isLowerThan(riskToTake: number) {
        return this.compareWith(riskToTake) === -1;
    }

    isLowerThanOrEquals(riskToTake: number) {
        return this.isLowerThan(riskToTake)  || this.isEquals(riskToTake);
    }
}