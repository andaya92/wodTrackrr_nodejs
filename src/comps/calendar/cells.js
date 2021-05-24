import { Grid, Paper, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

export default function mTea(){}

const Cell = withStyles(theme => ({
    root:{

        height:"0.75em"
    }
}))(Paper)

export const SuperCell = withStyles(theme => ({
    root:{
        background: `transparent`,
        display: "block",
        borderRadius: "4px",
        width: "100%",

    }
}))(Box)

export const SuperTextCell = withStyles(theme => ({
    root:{
        background: `transparent`,
        display: "block",
        width: "100%",
        height: "1em",

    }
}))(Box)


export const TextCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, transparent, transparent, ${theme.palette.primary.main} )`,
        height: "1em",
    }
}))(Cell)



export const CellRow = withStyles(theme => ({
    root:{
        display: "flex"
    }
}))(Grid)

export const RedCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, #ff0b0b, transparent)`,
    }
}))(Cell)

export const GreyCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, transparent)`,
    }
}))(Cell)

export const GreenCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg, #00fb42, #00fb42, ${theme.palette.primary.main})`,
    }
}))(Cell)

export const WhiteCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg,  white, white, ${theme.palette.primary.main})`,
    }
}))(Cell)

export const BlueCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg,  ${theme.palette.primary.main}, #6700c5)`,
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

export const LightGreyCell = withStyles(theme => ({
    root:{
        background: `linear-gradient(45deg,  grey, ${theme.palette.primary.main})`,
    }
}))(Cell)



