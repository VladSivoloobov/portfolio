export function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function convertWord(date, dateType){
    const lastNumber = +date.toString()[date.toString().length - 1]

    function strings(first, second, third){
        if(lastNumber === 1)
            return `${date} ${first}`;
        else if(lastNumber === 2 || lastNumber === 3)
            return `${date} ${second}`;
        else if(lastNumber >= 5 || lastNumber === 0)
            return `${date} ${third}`;
    }

    if(dateType?.hours)
        return strings("час", "часа", "часов");
    else if(dateType?.minutes)
        return strings("минута", "минуты", "минут")
    else if(dateType?.ms)
        return strings("миллисекунда", "миллисекунды", "миллисекунд");
}

export function changeTheme(color){
    const theme = document.head.querySelector("meta[name=theme-color]");
    theme.setAttribute("content", color);
}