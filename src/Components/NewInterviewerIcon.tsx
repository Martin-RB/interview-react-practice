import PersonAddOutlinedIcon from '@material-ui/icons/PersonAddOutlined';

export interface NewInterviewerIconProps{
    onClick: () => void
}

export default function NewInterviewerIcon(props: NewInterviewerIconProps){
    return <div className="interviewer-item" onClick={v=>props.onClick()}>
        <PersonAddOutlinedIcon className="icon"/>
        <span>Haz click aqui para añadir a otro entrevistador</span>
    </div>
}