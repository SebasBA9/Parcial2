const { selectRandomWord, calculateUserScore } = require('../../controllers/game.controller');
const { words } = require('../../words/words');

describe('Unit Tests for Game Functionality', () => {
    describe('selectRandomWord Function Tests', () => {
        it('should return a word that starts with the specified letter', () => {
            const startingLetter = 'b'; // Based on your actual words list, 'bici', 'bosque', etc.
            const word = selectRandomWord(startingLetter);
            expect(word[0].toLowerCase()).toBe(startingLetter);
        });

        it('should throw an error if the starting letter is not a single alphabetic character', () => {
            expect(() => selectRandomWord('123')).toThrow("Invalid starting letter.");
            expect(() => selectRandomWord(null)).toThrow("Invalid starting letter.");
            expect(() => selectRandomWord('')).toThrow("Invalid starting letter.");
        });

        it('should throw an error if no word starts with the provided starting letter', () => {
            const rareLetter = 'qq'; // 'qq' does not start any word in your list
            expect(() => selectRandomWord(rareLetter)).toThrow("No words start with the provided starting letter.");
        });

        it('should validate that the function accepts a valid parameter and returns a word for a common letter', () => {
            const commonLetter = 'a'; // 'agua', 'aire', etc.
            const word = selectRandomWord(commonLetter);
            expect(word).toBeTruthy();
            expect(word[0].toLowerCase()).toBe(commonLetter);
        });
    });

    describe('calculateUserScore Function Tests', () => {
        it('should return the length of the array passed to it, verifying the correct score calculation', () => {
            const usedWords = ['manzana', 'agua', 'sol'];
            const score = calculateUserScore(usedWords);
            expect(score).toBe(usedWords.length);
        });
    });
});
