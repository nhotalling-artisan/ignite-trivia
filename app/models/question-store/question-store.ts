import { Instance, SnapshotOut, types, flow } from "mobx-state-tree"
import { QuestionModel, QuestionSnapshot, Question } from "../question/question"
import { withEnvironment } from "../extensions"
import { GetQuestionsResult } from "../../services/api"

/**
 * Model description here for TypeScript hints.
 */
export const QuestionStoreModel = types
  .model("QuestionStore")
  .props({
    questions: types.optional(types.array(QuestionModel), []),
  })
  .extend(withEnvironment)
  .views(self => ({})) // eslint-disable-line @typescript-eslint/no-unused-vars
  .actions(self => ({
    saveQuestions: (questionSnapshots: QuestionSnapshot[]) => {
      const questionModels: Question[] = questionSnapshots.map(c => QuestionModel.create(c)) // create model instances from the plain objects
      self.questions.replace(questionModels) // Replace the existing data with the new data
    },
  }))
  .actions(self => ({
    getQuestions: flow(function*() {
      const result: GetQuestionsResult = yield self.environment.api.getQuestions()

      if (result.kind === "ok") {
        self.saveQuestions(result.questions)
      } else {
        __DEV__ && console.tron.log(result.kind)
      }
    }),
  }))

/**
 * Notice we’ve added the line .extend(withEnvironment).
 * Extensions are a neat way of sharing commonly used patterns in MST.
 * In this case, it adds a view to the model called environment which calls MST’s getEnv function,
 * and returns the contents of our environment (located in app/models/environment.ts).
 * Check out the docs to learn more about getEnv and dependency injection in MST.
 *
 * The reason for using two .action blocks has to do with the timing of when actions are added to self.
 * In order to call the action saveQuestions on self, we needed to have already defined it in a different
 * .action block. See the docs for bit more information about this subtle gotcha.
 */

/**
  * Un-comment the following to omit model attributes from your snapshots (and from async storage).
  * Useful for sensitive data like passwords, or transitive state like whether a modal is open.

  * Note that you'll need to import `omit` from ramda, which is already included in the project!
  *  .postProcessSnapshot(omit(["password", "socialSecurityNumber", "creditCardNumber"]))
  */

type QuestionStoreType = Instance<typeof QuestionStoreModel>
export interface QuestionStore extends QuestionStoreType {}
type QuestionStoreSnapshotType = SnapshotOut<typeof QuestionStoreModel>
export interface QuestionStoreSnapshot extends QuestionStoreSnapshotType {}
