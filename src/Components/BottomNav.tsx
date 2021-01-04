import { Button } from "@material-ui/core";
import React from "react";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

export interface BottomNavProps{
    backButton?: boolean
    forwardButton?: boolean
    backButtonDisabled?: boolean
    forwardButtonDisabled?: boolean
    backButtonText?: string
    forwardButtonText?: string
    onClickedBackButton?: () => void
    onClickedForwardButton?: () => void
}

export default class BottomNav extends React.Component<BottomNavProps>{
    render(){
        return <div id="bottom-navigation">
            {
                this.props.backButton?
                <Button disabled={this.props.backButtonDisabled}
                    className="left"
                    variant="contained"
                    onClick={v=>{
                        this.props.onClickedBackButton?.call(this);
                    }}>
                        <ArrowBackIcon/> {this.props.backButtonText ?? "Regresar"}
                </Button>: null
            }

            {
                this.props.forwardButton?
                <Button disabled={this.props.forwardButtonDisabled}
                    className="right"
                    variant="contained"
                    onClick={v=>{
                        this.props.onClickedForwardButton?.call(this);
                    }}>
                        {this.props.forwardButtonText ?? "Continuar"} <ArrowForwardIcon/>
                </Button>: null
            }
        </div>
    }
}