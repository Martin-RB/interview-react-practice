import Question from "./Question";

export default interface AnsweredQuestion{
    question: Question
    answer?: number // 0: none, 1: correct, 2: incorrect
    comments?: string
    isCorrect?: boolean
}