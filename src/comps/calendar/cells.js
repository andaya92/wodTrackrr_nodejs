import { Grid, Paper, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export default function mTea(){}

const Cell = withStyles(theme => ({
    root:{
        borderRadius: "4px",
        height:"5px"
    }
}))(Paper)

export const SuperCell = withStyles(theme => ({
    root:{
        background: `transparent`,
        display: "block",
        borderRadius: "4px",
        padding: "0px 0px 0px 2px",
        margin: "1px auto",
        width: "12%",
        height: "6px"

    }
}))(Box)


export const CellRow = withStyles(theme => ({
    root:{
        display: "flex"
    }
}))(Grid)

export const RedCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, transparent, #ff0b0b, transparent)`,
    }
}))(Cell)

export const GreyCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, transparent, grey, transparent)`,
    }
}))(Cell)

export const GreenCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, transparent, #00fb42, #00fb42, ${theme.palette.primary.main})`,
    }
}))(Cell)

export const WhiteCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, transparent,  white, ${theme.palette.primary.main})`,
    }
}))(Cell)

export const BlueCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, transparent,  ${theme.palette.primary.main}, #6700c5)`,
    }
}))(Cell)


export const PurpleCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, white, #1118f3, #1118f3, white)`,
    }
}))(Cell)


export const GoldCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, white, #ffeb00, #ffeb00, white)`,
    }
}))(Cell)
