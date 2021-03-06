import React, { Component } from 'react'

import
{ 	Grid, Typography
}
from '@material-ui/core';

import { withTheme } from '@material-ui/core/styles';


import {CellRow, SuperCell, RedCell, GreenCell, WhiteCell, GreyCell} from "./cells"
import "../../styles.css"

import { DateTime } from 'luxon'


function cellData(color="grey", valid=false, isToday=false){
    return {
        color: color,
        valid: valid,
        isToday: isToday
    }
}


class CalendarScoreView extends Component {
	constructor(props){
		super(props)
        let today = DateTime.now()
		this.state = {
			userMD: props.userMD,
            scores: props.scores,
            calendar: this.createCalendar(today),
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
        console.log(last)
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
        let fullWeek1 = []
        let fullWeek2 = []
        let lastWeek  = []

        for(let i=0; i<7; i++){
            fullWeek.push(cellData("white", true, false))
        }

        fullWeek1 = [...fullWeek]
        fullWeek2 = [...fullWeek]

        for(let i=0; i<first.weekday; i++){
            firstWeek.push(cellData())
        }
        for(let i=first.weekday; i<7; i++){
            firstWeek.push(cellData("white", true, false))
        }
        for(let i=0; i<=last.weekday; i++){
            lastWeek.push(cellData("white", true, false))
        }
        for(let i=last.weekday + 1; i<7; i++){
            lastWeek.push(cellData())
        }

        let calendar = [[...firstWeek], [...fullWeek], [...fullWeek1], [...fullWeek2], [...lastWeek]]

        // Fill in passed days w/ red
        // Start and end days' offset corresponding to 2d array
        let startOffset = this.getOffsetDayOfMonthFromDate(first)
        let endOffset = this.getOffsetDayOfMonthFromDate(today)

        // convert to 1d array start and end position
        let start = (startOffset[0] * startOffset[1]) + startOffset[1]
        let end = (endOffset[0] * endOffset[1]) + endOffset[1]

        for(let i=start; i<end; i++){
            // convert back to 2d array offsets
            let r = parseInt(i/7)
            let c = i%7

            calendar[r][c] = cellData("red", true, false)
        }

        // Mark cell as today
        let r = parseInt(end/7)
        let c = end%7
        calendar[r][c] = cellData("white", true, true)

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
        let calendar = [...this.state.calendar]

        for(let score of this.state.scores){
            let scoreDate = DateTime.fromMillis(score.date)
            let [row, col] = this.getOffsetDayOfMonthFromDate(scoreDate)
            let isToday = (scoreDate.day === this.state.today.day
                && scoreDate.month === this.state.today.month
                && scoreDate.year === this.state.today.year)

            calendar[row][col] = cellData("green", true, isToday)
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
                <Grid item xs={3}></Grid>
                <Grid item container xs={6}>

                    {
                    this.fillCalendar().map((week, i) => {
                        let flipDir = i%2==0? "flip-right": "flip-left"

                        return <CellRow className={flipDir}
                                item xs={12}
                                key={i}>

                                {week.map((day, j) => {
                                    let border = day.isToday? "whiteBorder": ""
                                    console.log(border)
                                    if(day.color === 'green'){
                                        return <SuperCell key={j}>
                                            <GreenCell className={border}/>
                                        </SuperCell>
                                    }else if(day.color === 'white'){
                                        return <SuperCell key={j}>
                                            <WhiteCell  className={border}/>
                                        </SuperCell>
                                    }else if(day.color === 'red'){
                                        return <SuperCell key={j}>
                                            <RedCell className={border}/>
                                        </SuperCell>
                                    }
                                    return <SuperCell key={j}>
                                        <GreyCell className={border} />
                                    </SuperCell>
                                })}
                        </CellRow>
                    })
                    }
                </Grid>
			</Grid>
		)
	}
}


export default CalendarScoreView = withTheme(CalendarScoreView);

