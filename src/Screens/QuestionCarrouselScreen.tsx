import { Button, duration, FormControlLabel, FormLabel, Radio, RadioGroup, Slide, TextField } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import React, { useState, useContext, useEffect } from "react";
import { Redirect, RouteChildrenProps } from "react-router-dom";
import GlobalDataContext from "../Context";
import AnsweredQuestion from "../Types/AnsweredQuestion";

type CarrouselState = {
    idx: number
    lastCommand: "-" | "+" | ""
}

export default function QuestionCarrouselScreen(props: RouteChildrenProps){
    const context = useContext(GlobalDataContext)
    
    const [carrousel, setCarrousel] = useState({
        idx: 0,
        lastCommand: ""
    } as CarrouselState);

    let increase = () => {
        if(carrousel.idx >= context.answeredQuestions.length){
            return
        }
        setCarrousel({
            idx: carrousel.idx + 1,
            lastCommand: "+"
        })
    }
    let decrease = () => {
        if(carrousel.idx <=0){
            return
        }
        setCarrousel({
            idx: carrousel.idx - 1,
            lastCommand: "-"
        })
    }

    let onChangeAnswer = (idx:number, answer:number) => {
        let questions = context.answeredQuestions
        let question = questions[idx]
        question.answer = answer
        
        context.onAnsweredQuestionUpdate(idx, question)
    }

    let onChangeComments = (idx:number, comments:string) => {
        let questions = context.answeredQuestions
        let question = questions[idx]
        question.comments = comments
        
        context.onAnsweredQuestionUpdate(idx, question)
    }
    let onBack = () => {
        props.history.push("/interviewed")
    }
    let onForward = () => {
        props.history.push("/results")
    }

    useEffect(() => {
        context.setBottomNavProps({
            backButton: true,
            forwardButton: true,
            forwardButtonDisabled:
                context.answeredQuestions.findIndex(v=>v.answer===undefined)!==-1,            
            onClickedBackButton: onBack,
            onClickedForwardButton: onForward,
        })
    }, [context])

    if(!context.interviewed || context.answeredQuestions.length === 0){
        return <Redirect to="/interviewers"/>
    }

    return(<div id="questions">
        
        <h1>Preguntas</h1>
        <div id="question-container">
            {
                carrousel.idx > 0?
                <Button
                onClick={v=>decrease()}>
                    Left
                </Button>:<div/>
            }
            {
                context.answeredQuestions.map((v,i)=>
                    <Slide direction={
                            carrousel.lastCommand === "+"? "left":
                            carrousel.lastCommand === "-"? "right":
                            "up"
                        } 
                        key={i.toString()}
                        in={carrousel.idx === i} 
                        timeout={{
                            enter: duration.enteringScreen,
                            exit: 0
                        }}
                        mountOnEnter
                        unmountOnExit>
                            <QuestionComponent 
                                questionText={v.question.question}
                                comments={v.comments??""}
                                answer={v.answer??0}
                                type={v.question.type}
                                onChangeAnswer={v=>onChangeAnswer(i,v)}
                                onChangeComments={v=>onChangeComments(i,v)}
                                />
                    </Slide>
                )
            }
            {
                carrousel.idx < context.answeredQuestions.length - 1?
                <Button
                    onClick={v=>increase()}>
                        Right
                </Button>:<div/>
            }
        </div>
        <h2 className="g-txtcenter">{carrousel.idx+1}/{context.answeredQuestions.length}</h2>
    </div>)
}

interface QuestionComponentProps{
    type: string
    questionText: string
    answer: number // 0: none, 1: correct, 2: incorrect
    comments: string
    onChangeAnswer: (answer: number) => void
    onChangeComments: (comments: string) => void
} 
const QuestionComponent = React.forwardRef((props: QuestionComponentProps, ref: any)=>{
    let onChangeAnswer = (answer: number) => {
        props.onChangeAnswer(answer)
    }
    let onChangeComments = (comments: string) => {
        props.onChangeComments(comments)
    }
    return <div ref={ref} className="question-slide">
        <h3>{props.type}</h3>
        <p><b>{props.questionText}</b></p>
        <div>
        <FormControl component="fieldset">
        <RadioGroup aria-label="answer" row
            name="answer" 
            value={props.answer} 
            onChange={(e, v)=>{onChangeAnswer(parseInt(v))}}>
                <FormControlLabel 
                    value={1}
                    labelPlacement="bottom"
                    control={<Radio />} 
                    label="Correcto" />
                <FormControlLabel 
                    value={2}
                    labelPlacement="bottom"
                    control={<Radio />} 
                    label="Incorrecto" />
        </RadioGroup>
        </FormControl>
        </div>

        <FormLabel>Comentarios: </FormLabel>
        <TextField value={props.comments}
            variant="outlined"
            onChange={({target:{value}}) => onChangeComments(value)}/>

    </div>
})