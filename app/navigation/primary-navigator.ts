import createNativeStackNavigator from "react-native-screens/createNativeStackNavigator"
import { QuestionScreen } from "../screens/question-screen/question-screen"

export const PrimaryNavigator = createNativeStackNavigator(
  {
    question: { screen: QuestionScreen },
  },
  {
    headerMode: "none",
  },
)

/**
 * A list of routes from which we're allowed to leave the app when
 * the user presses the back button on Android.
 *
 * Anything not on this list will be a standard `back` action in
 * react-navigation.
 */
export const exitRoutes: string[] = ["question"]
