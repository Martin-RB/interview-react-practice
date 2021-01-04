import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import CancelIcon from '@material-ui/icons/Cancel';

export interface InterviewerIconProps{
    name: string
    eID: string
    employeeId: string
    onDeleteClick: () => void
}

export default function InterviewerIcon(props: InterviewerIconProps){
    return <div className="interviewer-item">
        <div className="delete" onClick={v=>props.onDeleteClick()}>
            <CancelIcon/>
        </div>
        <PermIdentityOutlinedIcon className="icon"/>
        <span>{props.name}</span>
        <span>{props.employeeId}</span>
        <span>{props.eID}</span>
    </div>
}