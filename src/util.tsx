export const timeToString = (hour: number, minute: number) => { 
    return ( ((hour%12 == 0) ? 12 : (hour%12) ).toString().padStart(2, "0") + ":" 
        + minute.toString().padStart(2, "0") 
        + (hour < 12 ? "AM" : "PM") );
};