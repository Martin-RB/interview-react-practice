import { TextField } from "@material-ui/core"
import React from "react"

export interface OpenFieldProps{
    label: string
    value: string
    onValueChanged: (newValue: string) => void
}

export default function OpenField(props: OpenFieldProps){
    return (
    <div>
        <div><label>{props.label}</label></div>
        <TextField
            value={props.value}
            onChange={({target:{value}}) => {
                props.onValueChanged(value)
            }}/>
    </div>
    )
}