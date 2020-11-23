export default function cvtReps(x){
	return parseInt(x)
}

export function cvtTimetoInt(x){
	console.log("Split", x)
	let [mins, seconds] = x.split(":")
	return (parseInt(mins) * 60) + parseInt(seconds)
}


export function cvtIntToTime(x){
	let mins = Math.floor(x / 60)
	let secs = x - (mins*60)
	if(secs < 10){
		secs = `0${secs}`
	}
	return `${mins}:${secs}`
}