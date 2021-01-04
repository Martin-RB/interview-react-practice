import { Checkbox, FormControlLabel, FormGroup, Grid, MenuItem, Select, TextField } from "@material-ui/core";
import React from "react";
import GlobalDataContext from "../Context";
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import InterviewedTypes from "../Types/InterviewedTypes";
import Skill, { sampleSkills } from "../Types/Skill";
import BottomNav from "../Components/BottomNav";
import { Redirect, RouteChildrenProps } from "react-router";
import { QuestionPool } from "../Types/Question";
import AnsweredQuestion from "../Types/AnsweredQuestion";

type SelectableSkill = {
    skill: Skill,
    isSelected: boolean
}

interface InterviewedScreenState{
    name: string
    email: string
    idxType: number
    selectedSkills: SelectableSkill[]
    initialized: boolean
}

export default class InterviewedScreen extends React.Component<RouteChildrenProps, InterviewedScreenState>{
    static contextType = GlobalDataContext
    context!: React.ContextType<typeof GlobalDataContext>
    sampleInterTypes = [
        InterviewedTypes.Intern,
        InterviewedTypes.Employee,
        InterviewedTypes.CEO,
        InterviewedTypes.PizzaDeliver
    ]

    hasUpdatedNav: boolean = false

    constructor(props: RouteChildrenProps){
        super(props);

        let skills = sampleSkills;
        let selectedSkills = skills.map(v => {
            return {skill: v, isSelected: false} as SelectableSkill            
        })
        
        this.state = {
            selectedSkills,
            name: "",
            email: "",
            idxType: -1,
            initialized: false
        }
        
    }

    onBack = () => {
        this.props.history.push("/interviewers");
    }

    onForward = () => {
        let skills = this.state.selectedSkills.filter(v=>v.isSelected).map(v=>v.skill);
        this.context.onInterviewedSet({
            email: this.state.email,
            fullName: this.state.name,
            skills,
            type: this.sampleInterTypes[this.state.idxType]
        })

        let justSkillNames = skills.map(v=>v.name)??[]
        const questions = QuestionPool.filter(v=>{
            return justSkillNames.includes(v.type)
        })
        this.context.onAnsweredQuestionSet(
            questions.map(v=>({
                question:v
            } as AnsweredQuestion))
        )
        this.props.history.push("/questions")
    }

    onChangeInterviewedType = (idx: number) => {
        this.setState({
            idxType: idx
        })
        
    }

    onChangeSkill = (idx: number) => {
        let selectedSkills = [...this.state.selectedSkills]
        let skill = selectedSkills[idx]
        skill.isSelected = !skill.isSelected
        selectedSkills.splice(idx, 1, skill)
        this.setState({
            selectedSkills
        })
    }

    componentDidMount(){
        let isAllFilled = this.checkFilled();
        this.context.setBottomNavProps({
            backButton: true,
            forwardButton: true,
            forwardButtonDisabled: !isAllFilled,
            onClickedBackButton: this.onBack,
            onClickedForwardButton: this.onForward
        })
    }

    componentDidUpdate(){
        if(!this.hasUpdatedNav){
            let isAllFilled = this.checkFilled();
            this.context.setBottomNavProps({
                forwardButtonDisabled: !isAllFilled,
            })
            this.hasUpdatedNav = true
        }
        else{
            this.hasUpdatedNav = false
        }
    }

    render(){
        let lastInter = this.context?.interviewed

        if(lastInter && !this.state.initialized){
            this.setState({
                name: lastInter.fullName,
                email: lastInter.email,
                idxType: this.sampleInterTypes.findIndex(v=>v===lastInter?.type),
                selectedSkills: this.state.selectedSkills.map(v=>({
                    ...v,
                    isSelected: lastInter?.skills.find(lv=>lv.name === v.skill.name) !== undefined
                })),
                initialized: true
            })
        }

        
        return (
            <>
            {this.context.interviewers.length === 0? <Redirect to="/interviewers"/>: null}
            <div id="interviewed">
                <h2>Candidato</h2>
                <Grid container>
                    <Grid container item xs={12} md={6} alignContent="flex-start" id="left-card">
                        <Grid item xs={2}>
                            <PermIdentityOutlinedIcon/>
                        </Grid>
                        <Grid item xs={10}>
                            <div>
                                <div><label>Nombre del candidato</label></div>
                                <TextField
                                    value={this.state.name}
                                    onChange={({target:{value:name}}) => {
                                        this.setState({name})
                                    }}/>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div>
                                <div><label>Correo electronico</label></div>
                                <TextField
                                    value={this.state.email}
                                    onChange={({target:{value:email}}) => {
                                        this.setState({email})
                                    }}/>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <div>
                                <div><label>Tipo</label></div>
                                <Select defaultValue={-1}
                                    value={this.state.idxType}
                                    onChange={({target: {value}})=>this.onChangeInterviewedType(value as number)}>
                                        <MenuItem value={-1} selected>Seleccione un tipo</MenuItem>
                                        {this.sampleInterTypes.map((v,i) => 
                                            <MenuItem value={i} key={i.toString()}>{v}</MenuItem>)
                                        }
                                </Select>
                            </div>
                        </Grid>
                    </Grid>

                    <Grid container item xs={12} md={6} id="right-card">
                        <Grid item xs={12}>
                            <h2>Skills a evaluar</h2>
                        </Grid>
                        <Grid item xs={6}>
                            <FormGroup>
                                {
                                    this.state.selectedSkills.map((v,i) => {
                                        if(i%2!==0) return null;                                  
                                        return <FormControlLabel key={i.toString()}
                                            onChange={v=>this.onChangeSkill(i)}
                                            control={<Checkbox checked={v.isSelected} name={v.skill.name}/>}
                                            label={v.skill.name}/>
                                    })
                                }
                            </FormGroup>
                        </Grid>
                        <Grid item xs={6}>
                            <FormGroup>
                                {
                                    this.state.selectedSkills.map((v,i) => {           
                                        if(i%2===0) return null;                             
                                        return <FormControlLabel key={i.toString()}
                                            onChange={v=>this.onChangeSkill(i)}
                                            control={<Checkbox checked={v.isSelected} name={v.skill.name}/>}
                                            label={v.skill.name}/>
                                    })
                                }
                            </FormGroup>
                        </Grid>
                    </Grid>
                    
                </Grid>
                {JSON.stringify(this.context.interviewers)}
            </div>
            </>
        )
    }

    checkFilled = () => {
        return this.state.name !== "" 
            && this.state.email !== ""
            && this.state.idxType !== -1
            && this.state.selectedSkills
                .findIndex(v=>v.isSelected) !== -1
    }
}