function CalculateAverage(grades){
    if (!grades || grades.length == 0){
        throw new Error("grade es required");
    }

    const sum = grades.reduce((a, b)=> a + b, 0);
    return sum / grades.length;

}

function isPassing(average){
    return average >= 3;

}
function isData(data){
    return data? "si vino " : " vamos";
}

module.exports = {
    CalculateAverage,
    isPassing,
    isData
}