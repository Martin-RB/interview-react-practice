import { Button, Dialog, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, RouteChildrenProps } from "react-router";
import GlobalDataContext from "../Context";
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';

interface KeyValue<T>{
    [key: string]: T
}

export default function ResultsScreen(props: RouteChildrenProps){
    const context = useContext(GlobalDataContext)
    const [isQstnModalOpened, setQstnModalOpened] = useState(false)
    
    let onBack = () => {
        props.history.goBack()
    }

    let onForward = () => {
        props.history.push("www.google.com")
    }

    let onModalClose = () => {
        setQstnModalOpened(false)
    }

    let onModalOpen = () => {
        setQstnModalOpened(true)
    }
    useEffect(() => {
        context.setBottomNavProps({
            backButton: true,
            forwardButton: true,
            onClickedBackButton: onBack,
            onClickedForwardButton: onForward,
        })
    }, [context])

    let interviewed = context.interviewed
    let questions = context.answeredQuestions
    if(!interviewed || questions.length === 0) return <Redirect to="/interviewers"/>

    function fromDataToRow(question:string, answer:string, comments:string) {
        return { question, answer, comments };
    }

    // A function to prevent unnecesary variables on main context
    let processData = () => {
        let skillSet = interviewed!.skills ?? []
        let skillGradeKv: KeyValue<number> = {}
        let skillQAmountKv: KeyValue<number> = {}
        skillSet.forEach(v => {
            skillQAmountKv[v.name] = skillGradeKv[v.name] = 0
        })
        let rows = questions.map(v=>{
            
            skillQAmountKv[v.question.type]++
            if(v.answer === 1) skillGradeKv[v.question.type]++
            return fromDataToRow(v.question.question, 
                (v.answer && v.answer === 1)? "Correcto": "Incorrecto", 
                v.comments ?? "")
        })

        skillSet.forEach(v => {
            skillGradeKv[v.name] /= skillQAmountKv[v.name]
        })

        return {rows, skillGradeKv}
    }
    let {rows, skillGradeKv} = processData()

    let skillSet = []
    let skillGrades = []

    for (const k in skillGradeKv) {
        if (Object.prototype.hasOwnProperty.call(skillGradeKv, k)) {
            const v = skillGradeKv[k];
            skillSet.push(k)
            skillGrades.push(v)
        }
    }
    return <>
        <h1>Resumen</h1>
        {!context.interviewed || context.answeredQuestions.length==0? <Redirect to="/interviewers"/>:null}
        <Grid container className="results">
            <Grid item xs={12} md={6}>
                <h2>Datos del candidato</h2>
                <div><span>Nombre completo</span></div>
                <b>{interviewed.fullName}</b>
                <div><span>Correo electronico</span></div>
                <b>{interviewed.email}</b>
                <div><span>Tipo</span></div>
                <b>{interviewed.type}</b>
            </Grid>
            <Grid container item xs={12} md={6}>
                <Grid item xs={6}>
                    <h2 className="g-subheader">Resultados</h2>
                </Grid>
                <Grid item xs={6}>
                    <Button onClick={()=>onModalOpen()}>Ver resultados</Button>
                </Grid>
                <Grid item xs={6}>
                    <div><span>Skills</span></div>
                    {
                        skillSet.map((v,i)=>
                            <p key={i.toString()}>{v}</p>)
                    }
                </Grid>
                <Grid item xs={6}>
                    
                    <div><span>Puntaje</span></div>
                    {
                        skillGrades.map((v,i)=>
                            <p key={i.toString()}>{(v*100).toFixed(2)} %</p>)
                    }
                </Grid>
            </Grid>
        </Grid>
        <Dialog open={isQstnModalOpened} maxWidth="md"
            onClose={v => onModalClose()}
            aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <PersonAddOutlinedIcon fontSize="large"/> Preguntas
                </DialogTitle>
                <DialogContent className="modal">
                <TableContainer className="modal-table">
                    <Table aria-label="sticky table" size="small" stickyHeader>
                        <TableHead>
                        <TableRow>
                            <TableCell>Pregunta</TableCell>
                            <TableCell align="right" size="small">REspuesta</TableCell>
                            <TableCell align="right">Comentario</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.question}>
                            <TableCell component="th" scope="row">
                                {row.question}
                            </TableCell>
                            <TableCell align="right">{row.answer}</TableCell>
                            <TableCell align="right">{row.comments}</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                    </TableContainer>
                </DialogContent>
            {/* <DialogActions>
                <Button onClick={e => this.onAddNewInterviewer()} color="primary">
                    Guardar
                </Button>
            </DialogActions> */}
        </Dialog>
    </>
}