import { Instance, SnapshotOut, types } from "mobx-state-tree"
import shuffle from "lodash.shuffle"

// Created by running 'ignite generate model question'
// This is the MobX State Tree (MST) model for question.

/**
 * A trivia questions with several answer choices
 */
export const QuestionModel = types
  .model("Question")
  .props({
    id: types.identifier, // MST's version of a primary key
    category: types.maybe(types.string), // types.maybe means values can be undefined
    type: types.enumeration(["multiple", "boolean"]),
    difficulty: types.enumeration(["easy", "medium", "hard"]),
    question: types.maybe(types.string),
    correctAnswer: types.maybe(types.string),
    incorrectAnswers: types.optional(types.array(types.string), []), // types.optional will have a default value. In this case, it's [].
    guess: types.optional(types.string, ""),
  })
  .views(self => ({
    get allAnswers() {
      return shuffle(self.incorrectAnswers.concat([self.correctAnswer]))
    },
    get isCorrect() {
      return self.guess === self.correctAnswer
    },
  }))
  .actions(self => ({
    setGuess(guess: string) {
      self.guess = guess
    },
  }))

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type QuestionType = Instance<typeof QuestionModel>
export interface Question extends QuestionType {}
type QuestionSnapshotType = SnapshotOut<typeof QuestionModel>
export interface QuestionSnapshot extends QuestionSnapshotType {}
