import { Button, Dialog, DialogContent, DialogTitle, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { Redirect, RouteChildrenProps } from "react-router";
import GlobalDataContext from "../Context";
import HelpOutlineIcon from '@material-ui/icons/HelpOutline';
import CloseIcon from '@material-ui/icons/Close';

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

        return {rows, skillGradeKv, skillSet}
    }
    let {rows, skillGradeKv, skillSet} = processData()

    return <div id="results">
        <h1>Resumen</h1>
        {!context.interviewed || context.answeredQuestions.length==0? <Redirect to="/interviewers"/>:null}
        <Grid container id="card-container">
            <Grid item xs={12} md={6} className="card">
                <div id="left-card">
                    <h2 className="g-subheader">Datos del candidato</h2>
                    <div className="g-field">
                        <div><span className="label">Nombre completo</span></div>
                        <span className="text">{interviewed.fullName}</span>
                    </div>
                    <div className="g-field">
                        <div><span className="label">Correo electronico</span></div>
                        <span className="text">{interviewed.email}</span>
                    </div>
                    <div className="g-field">
                        <div><span className="label">Tipo</span></div>
                        <span className="text">{interviewed.type}</span>
                    </div>
                </div>
            </Grid>
            <Grid container item xs={12} md={6} id="right-card" className="card">
                <Grid item xs={6}>
                    <h2 className="g-subheader">Resultados</h2>
                </Grid>
                <Grid item xs={6}>
                    <Button id="see-results" onClick={()=>onModalOpen()}>Ver resultados</Button>
                </Grid>
                <Grid item xs={12}>
                <TableContainer id="table-container">
                    <Table aria-label="sticky table" size="small" stickyHeader className="g-table">
                        <TableHead>
                        <TableRow>
                            <TableCell className="header-cell">Skill</TableCell>
                            <TableCell className="header-cell" size="small">Puntaje</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {skillSet.map((v,i) => (
                            <TableRow key={i.toString()}>
                            <TableCell>
                                {v.name}
                            </TableCell>
                            <TableCell>{((skillGradeKv[v.name])*100).toFixed(2)} %</TableCell>
                            </TableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
                <h2 className="g-subheader">Comentarios</h2>
                <TextField fullWidth multiline variant="outlined"/>
            </Grid>
        </Grid>
        <Dialog open={isQstnModalOpened} maxWidth="lg"
            onClose={v => onModalClose()}
            aria-labelledby="header"
            id="results-modal" className="g-modal">
                <DialogTitle id="header">
                    <HelpOutlineIcon className="icon" fontSize="large"/> 
                        <span className="text">  Preguntas</span>
                        <div id="close" onClick={() => onModalClose()}>
                            <CloseIcon/>
                        </div>
                </DialogTitle>
                <DialogContent>
                <TableContainer className="modal-table" id="table">
                    <Table aria-label="sticky table" size="small" stickyHeader
                        className="g-table">
                        <TableHead>
                        <TableRow>
                            <TableCell className="header-cell">Pregunta</TableCell>
                            <TableCell className="header-cell answer-cell" size="small">Respuesta</TableCell>
                            <TableCell className="header-cell">Comentario</TableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {rows.map((row) => (
                            <TableRow key={row.question}>
                            <TableCell>{row.question}</TableCell>
                            <TableCell size="small" className="answer-cell">{row.answer}</TableCell>
                            <TableCell size="medium">{row.comments}</TableCell>
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
    </div>
}