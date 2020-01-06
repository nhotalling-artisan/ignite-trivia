import React, { useState, useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ViewStyle, View, TextStyle, FlatList, Alert, TouchableOpacity } from "react-native"
import { Screen, Text, Button } from "../../components"
import { useStores } from "../../models/root-store"
import { color, spacing } from "../../theme"
import { NavigationScreenProps, SafeAreaView } from "react-navigation"
import { Question } from "../../models/question"
import { RadioButtons } from "react-native-radio-buttons"

export interface QuestionScreenProps extends NavigationScreenProps<{}> {

}

export interface QuestionScreenState {
  refreshing: boolean
}

const ROOT: ViewStyle = {
  flex: 1,
  paddingHorizontal: spacing.large,
  backgroundColor: color.background,
}

const HEADER_CONTAINER: ViewStyle = {
  marginTop: spacing.extraLarge,
  marginBottom: spacing.medium,
}

const QUESTION: TextStyle = {
  fontWeight: "bold",
  fontSize: 16,
  marginVertical: spacing.medium,
}

const QUESTION_WRAPPER: ViewStyle = {
  borderBottomColor: color.line,
  borderBottomWidth: 1,
  paddingVertical: spacing.large,
}

const QUESTION_LIST: ViewStyle = {
  marginBottom: spacing.large,
}

const CHECK_ANSWER: ViewStyle = {
  paddingVertical: spacing.medium,
  backgroundColor: color.palette.angry,
  marginTop: spacing.medium,
}

const ANSWER: TextStyle = {
  fontSize: 12,
}

const ANSWER_WRAPPER: ViewStyle = {
  paddingVertical: spacing.small,
}

// Custom hook for state
function useScreenState(isRefreshing: boolean) {
  const [refreshing, setRefreshing] = useState(isRefreshing)

  return { refreshing, setRefreshing }
}

export const QuestionScreen: React.FunctionComponent<QuestionScreenProps> = observer(props => {
  // This replaces the old 'inject' method
  const { questionStore } = useStores()
  const { questions } = questionStore
  const { refreshing, setRefreshing } = useScreenState(false)

  const fetchQuestions = () => {
    setRefreshing(true)
    questionStore.getQuestions()
    setRefreshing(false)
  }

  const onPressAnswer = (question: Question, guess: string) => {
    question.setGuess(guess)
  }

  const checkAnswer = (question: Question) => {
    if (question.isCorrect) {
      Alert.alert("That is correct!")
    } else {
      Alert.alert(`Wrong! The correct answer is: ${question.correctAnswer}`)
    }
  }

  const renderAnswer = (answer: string, selected: boolean, onSelect: () => void, index) => {
    const style: TextStyle = selected ? { fontWeight: "bold", fontSize: 14 } : {}
    return (
      <TouchableOpacity key={index} onPress={onSelect} style={ANSWER_WRAPPER}>
        <Text style={{ ...ANSWER, ...style }} text={answer} />
      </TouchableOpacity>
    )
  }

  const renderQuestion = ({ item }) => {
    const question: Question = item
    return (
      <View style={QUESTION_WRAPPER}>
        <Text style={QUESTION} text={question.question} />
        <RadioButtons
          options={question.allAnswers}
          onSelection={guess => onPressAnswer(question, guess)}
          selectedOption={question.guess}
          renderOption={renderAnswer}
        />
        <Button style={CHECK_ANSWER} onPress={() => checkAnswer(question)} text={"Check Answer!"} />
      </View>
    )
  }

  // Replace ComponentDidMount with useEffect hook.
  // By default, useEffect runs when any props/state change.
  // To run on first render only, pass empty array as second argument.
  // This second argument typically is used to monitor which values should
  // cause the side effect to trigger, eg [props.source].
  useEffect(() => {
    fetchQuestions()
  }, [])

  return (
    <Screen style={ROOT}>
      <View style={HEADER_CONTAINER}>
        <Text preset="header" tx="questionScreen.header" />
      </View>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          style={QUESTION_LIST}
          data={questionStore.questions}
          renderItem={renderQuestion}
          extraData={{ extraDataForMobX: questions.length > 0 ? questions[0].question : "" }}
          keyExtractor={item => item.id}
          onRefresh={fetchQuestions}
          refreshing={refreshing}
        />
      </SafeAreaView>
    </Screen>
  )
})
