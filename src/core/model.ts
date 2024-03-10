export type Suit = 'HEARTS' | 'DIAMONDS' | 'SPADES' | 'CLUBS';
export type Value = 'ACE' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'JACK' | 'QUEEN' | 'KING';

export interface ValuedCardModel {
    suit: Suit;
    value: Value;
}

export type Joker = 'JOKER';
export type CardModel = ValuedCardModel | Joker;