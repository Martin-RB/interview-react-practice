import { Grid } from "@material-ui/core";
import Button from "@material-ui/core/Button/Button";
import Container from "@material-ui/core/Container/Container";
import React from "react";
import GlobalDataContext from "../Context";

export default class TestComponent extends React.Component{

    static contextType = GlobalDataContext
    render(){
        console.log(this.context);
        
        return (<>
            <Container>
                <Grid container>
                    <Grid item xs={4}>
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet saepe exercitationem vel est asperiores, impedit in odio hic unde aliquam ipsa cumque quasi numquam culpa et quod harum error repudiandae.
                        </p>
                        <Button onClick={e=>{
                            this.context.onNumChange(this.context.num + 1)
                        }}>
                            +1
                        </Button>
                        <Button onClick={e=>{
                            this.context.onNumChange(this.context.num - 1)
                        }}>
                            -1
                        </Button>
                    </Grid>
                    <Grid item xs={8}>
                        <p>Counter is {this.context.num}</p>
                    </Grid>
                </Grid>
            </Container>
        </>)
    }
}