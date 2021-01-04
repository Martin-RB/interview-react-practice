import { each, makeFactory } from "factory.ts/lib/sync";
import * as faker from "faker";
import { sampleSkills } from "./Skill";

export default interface Question{
    id: number
    question: string
    type: string
}

let questionFac = (type:string) => makeFactory<Question>({
    id: each(i=>faker.random.number()),
    question: each(i=>faker.hacker.phrase() + "?"),
    type
})
export var QuestionPool = sampleSkills.map(v=>
    questionFac(v.name).buildList(faker.random.number(10) + 2)
).reduce((p, c)=>p.concat(c), [])