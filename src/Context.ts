import React from "react"
import Interviewed from "./Types/Interviewed"
import Interviewer from "./Types/Interviewer"
import AnsweredQuestion from "./Types/AnsweredQuestion";
import { BottomNavProps } from "./Components/BottomNav";

export type GlobalDataType = {
    interviewers: Interviewer[],
    onInterviewerAdd: (newInterr: Interviewer) => void,
    onInterviewerRemove: (idx: number) => void,
    interviewed: Interviewed | undefined,
    onInterviewedSet: (newInterd: Interviewed | undefined) => void
    answeredQuestions: AnsweredQuestion[],
    onAnsweredQuestionSet: (newQuestions: AnsweredQuestion[]) => void
    onAnsweredQuestionUpdate: (idx: number, newAQuestion: AnsweredQuestion) => void
    setBottomNavProps: (props: BottomNavProps) => void
}

let globalData = {
    interviewers: [],
    onInterviewerAdd: () => {},
    onInterviewerRemove: () => {},
    interviewed: undefined,
    onInterviewedSet: () => {},
    answeredQuestions: [],
    onAnsweredQuestionSet: () => {},
    onAnsweredQuestionUpdate: () => {},
    setBottomNavProps: () => {}
} as GlobalDataType
var GlobalDataContext = React.createContext<GlobalDataType>(globalData)
export default GlobalDataContext

// export type BottomNavCtxType = {
//     setBottomNavProps: (props: BottomNavProps) => void
//     bottomNavProps: BottomNavProps
// }

// let bottomNavData = {
//     bottomNavProps: {},
//     setBottomNavProps: () => {}
// } as BottomNavCtxType
// export var BottomNavContext = React.createContext<BottomNavCtxType>(bottomNavData)