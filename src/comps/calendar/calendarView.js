import React, { Component } from 'react'

import{
    Grid, Typography
}from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles';

import {
    CellRow, SuperCell, LightGreyCell, SuperTextCell,
    TextCell, RedCell, GreenCell, WhiteCell, GreyCell,
} from "./cells"
import "../../styles.css"

import { DateTime } from 'luxon'


function cellData(color="grey", valid=false, isToday=false){
    return {
        color: color,
        valid: valid,
        isToday: isToday,
        count: 1
    }
}

/*   May has 6 weekns == Calendar only supports up to 5 apparently.

                Need to fix this

        1 sunday
        ...
        ...
        ...
        ...
        31 Monday



*/

class CalendarScoreView extends Component {
	constructor(props){
		super(props)
        let today = DateTime.now()
        this.calendar = this.createCalendar(today)
        console.log(today)
		this.state = {
			userMD: props.userMD,
            scores: props.scores,
            today: today
		}
	}

    componentDidUpdate(){

    }

	static getDerivedStateFromProps(props, state){
		return props
	}

    getFirstOfMonth(today){
        return DateTime.local(today.year, today.month, 1, 0, 0, 0, 0)
    }

    getEndOfMonth(today){
        return DateTime.local(today.year, today.month, today.daysInMonth, 0, 0, 0, 0)
    }


    getFirstAndLast(today){
        let first = this.getFirstOfMonth(today)
        let last = this.getEndOfMonth(today)
        return [first, last]
    }


    // Creates base calendar, with invalid days, passed days, and future days
    createCalendar(today){

        // First and last day of the month.
        let [first, last] = this.getFirstAndLast(today)

        // First week may contain invalid days from previous month
        // Middle weeks that have valid days
        // Last week may contain invalid days from next month
        let firstWeek = []
        let fullWeek  = []
        let lastWeek  = []

        for(let i=0; i<7; i++){
            fullWeek.push(cellData("white", true, false))
        }

        for(let i=0; i<first.weekday; i++){
            firstWeek.push(cellData())
        }

        for(let i=first.weekday; i<7; i++){
            firstWeek[i] = cellData("white", true, false)
        }

        for(let i=0; i<=last.weekday; i++){
            lastWeek.push(cellData("white", true, false))
        }
        for(let i=last.weekday + 1; i<7; i++){
            lastWeek[i] = cellData()
        }

        let calendar = [
            [...firstWeek],
            [...fullWeek],
            [...fullWeek],
            [...fullWeek],
            [...fullWeek],
            [...lastWeek]
        ]

        // Fill in passed days w/ red
        // Start and end days' offset corresponding to 2d array
        let startOffset = this.getOffsetDayOfMonthFromDate(first)
        let endOffset = this.getOffsetDayOfMonthFromDate(today)

        // convert to 1d array start and end position
        let start = (startOffset[0] * 7) + startOffset[1]

        let end = (endOffset[0] * 7) + endOffset[1]

        for(let i=start; i<end; i++){
            // convert back to 2d array offsets
            let r = parseInt(i/7)
            let c = i%7

            calendar[r][c] = cellData("red", true, false)
        }

        // Mark cell as today
        let row = parseInt(end/7)
        let col = end%7


        calendar[row][col] = cellData("white", true, true)

        // console.log("Base calendar")
        // console.log(startOffset, endOffset)
        // console.log(start, end)
        // console.log("tdoay", row, col)
        // console.log(calendar)

        return calendar
    }

    // Returns [row, col] of calendar from a timestamp
    getOffsetDayOfMonthFromDate(date){

        let firstDayOfMonth = this.getFirstOfMonth(date)

        let offset = firstDayOfMonth.weekday + date.day - 1
        let offsetWeek = parseInt(offset / 7)
        let offsetDay = offset %  7
        return [offsetWeek, offsetDay]
    }

    // Fill calendar with user's scores.
    fillCalendar(){
        let calendar = []
        for(let week of this.calendar){
            calendar.push([...week])
        }

        console.log(this.state.scores)
        for(let score of this.state.scores){
            let scoreDate = DateTime.fromMillis(score.date)
            let [row, col] = this.getOffsetDayOfMonthFromDate(scoreDate)
            let isToday = (scoreDate.day === this.state.today.day
                && scoreDate.month === this.state.today.month
                && scoreDate.year === this.state.today.year)

            if(calendar[row][col].color !== "green"){
                calendar[row][col] = cellData("green", true, isToday)
            }else{
                calendar[row][col].count += 1
            }
        }
        return calendar
    }


  	render(){
		return(
			<Grid item container xs={12}>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="subtitle2">
                        {this.state.today.monthLong}
                    </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
                <Grid item xs={10}>
                    <CellRow>
                        <SuperTextCell className="appearFast">
                            <TextCell square> S </TextCell>
                        </SuperTextCell>
                        <SuperTextCell className="appearFast">
                            <TextCell square> M </TextCell>
                        </SuperTextCell>
                        <SuperTextCell className="appearFast">
                            <TextCell square> T </TextCell>
                        </SuperTextCell>
                        <SuperTextCell className="appearFast">
                            <TextCell square> W </TextCell>
                        </SuperTextCell>
                        <SuperTextCell className="appearFast">
                            <TextCell square> T </TextCell>
                        </SuperTextCell>
                        <SuperTextCell className="appearFast">
                            <TextCell square> F </TextCell>
                        </SuperTextCell>
                        <SuperTextCell className="appearFast">
                            <TextCell square> S </TextCell>
                        </SuperTextCell>

                    </CellRow>
                </Grid>
                <Grid item xs={1}></Grid>

                <Grid item xs={12}>
                    <Grid item xs={1}></Grid>
                    <Grid item container xs={10}>

                        {
                        this.fillCalendar().map((week, i) => {


                            return <CellRow className="appearSlow"
                                    item xs={12}
                                    key={i}>

                                    {week.map((day, j) => {

                                        if(day.isToday){
                                            return <SuperCell key={j} className="appearFast">
                                                <WhiteCell square/>
                                            </SuperCell>
                                        }
                                        else if(day.color === 'green'){
                                            console.log(day)
                                            let Cell = null
                                            if(day.count === 1)
                                                Cell = GreenCell
                                            if(day.count === 2)
                                                Cell = GreenCell
                                            if(day.count === 3)
                                                Cell = GreenCell
                                            if(day.count > 3)
                                                Cell = GreenCell
                                            return <SuperCell key={j} className="appearFast">
                                                <Cell square/>
                                            </SuperCell>
                                        }else if(day.color === 'white'){
                                            return <SuperCell key={j}>
                                                <LightGreyCell square/>
                                            </SuperCell>
                                        }else if(day.color === 'red'){
                                            return <SuperCell key={j}>
                                                <RedCell square/>
                                            </SuperCell>
                                        }
                                        return <SuperCell key={j}>
                                            <GreyCell square/>
                                        </SuperCell>
                                    })}
                            </CellRow>
                        })
                        }
                    </Grid>

                </Grid>
			</Grid>
		)
	}
}


export default CalendarScoreView = withTheme(CalendarScoreView);

