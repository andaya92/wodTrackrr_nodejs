export default function cvtReps(x){
	return parseInt(x)
}

export function cvtTimetoInt(x){
	let [mins, seconds] = x.split(":")
	return (parseInt(mins) * 60) + parseInt(seconds)
}

export function dupNewLine(text){
	console.log("\n".charCodeAt(0))
	
	let newLinePattern = /\\n/
	let newText = text.replace(newLinePattern, "\\n\\n")
	
	for(let c of newText){
		console.log(c)
		console.log(c.charCodeAt(0))
	}
	return newText
}

export function cvtIntToTime(x){
	let mins = Math.floor(x / 60)
	let secs = Math.floor(x - (mins*60))
	if(secs < 10){
		secs = `0${secs}`
	}
	return `${mins}:${secs}`
}


export function cvtTimetoIntList(rawScores){
	return rawScores.map((score) => {
		cvtTimetoInt(score)
	})
}


export function msToDate(ms){
	return new Date(ms).toLocaleDateString("en-US")
}


export function formatDate(){
  const [{ value: month },,{ value: day },,{ value: year }] 
    = new Intl.DateTimeFormat('en', 
      { year: 'numeric', month: 'numeric', day: '2-digit' })
      .formatToParts(new Date())  
  console.log(new Intl.DateTimeFormat('en', 
      { year: 'numeric', month: 'numeric', day: '2-digit' }))
  return `${year}/${month}/${day}`
}
