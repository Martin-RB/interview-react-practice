import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Snackbar, TextField } from "@material-ui/core";
import React from "react";
import InterviewerIcon from "../Components/InterviewerIcon";
import NewInterviewerIcon from "../Components/NewInterviewerIcon";
import GlobalDataContext, { GlobalDataType } from "../Context";
import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';
import { RouteChildrenProps } from "react-router";

interface InterviewersScreenState{
    isModalOpen: boolean,
    m_fullName: string
    m_employeeId: string
    m_eID: string
    isAlertOpened: boolean
}

export default class InterviewersScreen extends React.Component<RouteChildrenProps,InterviewersScreenState,GlobalDataType>{

    static contextType = GlobalDataContext
    context!: React.ContextType<typeof GlobalDataContext>

    hasUpdatedNav: boolean = false

    constructor(props: RouteChildrenProps){
        super(props);

        this.state = {
            isModalOpen: false,
            m_fullName: "",
            m_employeeId: "",
            m_eID: "",
            isAlertOpened: false
        }
    }

    onDeleteInverviewer = (idx: number) => {
        this.context.onInterviewerRemove(idx);
    }

    onAddInterviewer = () => {
        this.setState({
            isModalOpen: true
        })
    }

    onAddNewInterviewer = () => {
        let {m_fullName
            ,m_employeeId
            ,m_eID} = this.state

        if(m_fullName == "" || m_employeeId == "" || m_eID == ""){
            this.setState({isAlertOpened: true})
            return
        }
        this.context.onInterviewerAdd({
            fullName: this.state.m_fullName,
            eID: this.state.m_eID,
            employeeId: this.state.m_employeeId
        })
        this.setState({
            isModalOpen: false,
            m_fullName: "",
            m_employeeId: "",
            m_eID: ""
        })
    }

    onModalClose = () => {
        this.setState({
            isModalOpen: false
        })
    }

    onContinue = () => {
        this.props.history.push("/interviewed")
    }

    componentDidMount(){
        this.context.setBottomNavProps({
            forwardButton: true,
            backButton: false,
            forwardButtonDisabled: this.context.interviewers.length <= 0,
            onClickedForwardButton: this.onContinue
        })
    }

    componentDidUpdate(){
            if(!this.hasUpdatedNav){
                this.context.setBottomNavProps({
                    forwardButtonDisabled: this.context.interviewers.length <= 0,
                })
                this.hasUpdatedNav = true
            }
            else{
                this.hasUpdatedNav = false
            }
    }
    
    omponentDidUpdate(){
        this.context.setBottomNavProps({
            forwardButtonDisabled: this.context.interviewers.length <= 0,
        })
    }

    render(){
        return <>
            <h1>Entrevistadores</h1>
            <div id="interviewer">
                {
                    this.context.interviewers.map((v,i)=>
                        <InterviewerIcon name={v.fullName} 
                            employeeId={`#${v.employeeId}`}
                            eID={v.eID}
                            onDeleteClick={() => this.onDeleteInverviewer(i)}
                            key={i.toString()}/>
                    )
                }
                <NewInterviewerIcon onClick={this.onAddInterviewer}/>
            </div>
            <Snackbar
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={this.state.isAlertOpened}
                autoHideDuration={6000}
                onClose={(e,r) => {
                    if (r === 'clickaway') {
                        return;
                    }
                    this.setState({isAlertOpened: false})
                }}
                message="Por favor llene todos los datos"
            />
            <Dialog open={this.state.isModalOpen} 
                onClose={v => this.onModalClose()}
                className="g-modal"
                aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title" className="title">
                        <PersonAddOutlinedIcon className="icon" fontSize="large"/> 
                        <span className="text">  Nuevo entrevistador</span>
                    </DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="fullName"
                            label="Nombre completo"
                            type="text"
                            value={this.state.m_fullName}
                            fullWidth
                            onChange={({target: {value}}) => {
                                this.setState({
                                    m_fullName: value
                                })
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="employeeId"
                            label="Id del empleado"
                            type="text"
                            value={this.state.m_employeeId}
                            fullWidth
                            onChange={({target: {value}}) => {
                                this.setState({
                                    m_employeeId: value
                                })
                            }}
                        />
                        <TextField
                            margin="dense"
                            id="eID"
                            label="EID"
                            type="text"
                            value={this.state.m_eID}
                            fullWidth
                            onChange={({target: {value}}) => {
                                this.setState({
                                    m_eID: value
                                })
                            }}
                        />
                    </DialogContent>
                <DialogActions>
                    <Button onClick={e => this.onAddNewInterviewer()} 
                        variant="contained"
                        color="primary">
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
            
        </>
    }
}