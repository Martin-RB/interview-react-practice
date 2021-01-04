import { Grid } from "@material-ui/core";
import React from "react";
import GlobalDataContext, { GlobalDataType } from "../Context";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import InterviewersScreen from "./../Screens/InterviewersScreen";
import InterviewedScreen from "./../Screens/InterviewedScreen";
import QuestionCarrouselScreen from "./../Screens/QuestionCarrouselScreen";
import ResultsScreen from "./../Screens/ResultsScreen";
import BottomNav, { BottomNavProps } from "./BottomNav";

interface InterviewMainState{
    globalData: GlobalDataType,
    bottomNav: BottomNavProps
}

export default class InterviewMain extends React.Component<any, InterviewMainState>{
    constructor(props:{}){
        super(props);
        this.state = {
            globalData: {
                interviewers: [],
                onInterviewerAdd: (newInterr) => {
                    this.setState(({globalData:s}) => {
                        let interviewers = [...s.interviewers]
                        interviewers.push(newInterr)
                        return {globalData:{...s, interviewers}}
                    })
                },
                onInterviewerRemove: (idx: number) => {
                    this.setState(({globalData:s}) => {
                        let interviewers = [...s.interviewers]
                        interviewers.splice(idx)
                        return {globalData: {...s, interviewers}}
                    })
                },
                interviewed: undefined,
                onInterviewedSet: (newInterd) => {
                    this.setState(({globalData})=>({
                        globalData: {...globalData, interviewed: newInterd}
                    }))
                },
                answeredQuestions: [],
                onAnsweredQuestionSet: (newQuestions) => {
                    this.setState(({globalData}) => ({
                        globalData: {...globalData, answeredQuestions: newQuestions}
                    }))
                },
                onAnsweredQuestionUpdate: (idx, newAQuestion) => {
                    this.setState(({globalData:s}) => {
                        let answeredQuestions = [...s.answeredQuestions]
                        answeredQuestions[idx] = newAQuestion
                        return {globalData: {...s, answeredQuestions}}
                    })
                },
                setBottomNavProps: (newProps) =>{
                    this.setState(({bottomNav}) => {
                        return {
                            bottomNav: {
                                ...bottomNav, ...newProps
                            }
                        }
                    })
                }
            },
            bottomNav: {},
        }
    }

    render(): JSX.Element{
        let globalData = this.state.globalData
        return (
            <div id="app">
            <Grid item xs={12} id="top-banner"/>
            <div id="container">
                <GlobalDataContext.Provider value={globalData}>
                    <Router>
                        <Switch>
                            <Route path="/interviewers" component={InterviewersScreen}/>
                            <Route path="/interviewed" component={InterviewedScreen}/>
                            <Route path="/questions" component={QuestionCarrouselScreen}/>
                            <Route path="/results" component={ResultsScreen}/>
                            <Route path="/">
                                <Redirect to="/interviewers"/>
                            </Route>
                        </Switch>
                    </Router>
                </GlobalDataContext.Provider>
            </div>
            <BottomNav {...this.state.bottomNav}/>
            </div>
        )
    }
}