// handle error where this function is called
async function get_ballon_location(hours_ago: number){
    if (hours_ago < 1 || hours_ago > 23 || !Number.isInteger(hours_ago)){
        throw Error("Invalid argument");
    }

    const url = `/api/windborn/treasure/${hours_ago.toString().padStart(2, '0')}.json`;
    const response = await fetch(url, {
        method: "GET",
    });

    return await response.json() as Array<[number, number, number]>;
}

export default get_ballon_location;
