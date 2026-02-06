export function getTodayAEDT() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: 'Australia/Sydney',
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

export function getTodayAEST() {
    return new Intl.DateTimeFormat("en-CA", {
        timeZone: 'Australia/Melbourne',
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date());
}

export function decideTimezone() {
    // Function to decide timezone for ASX based on the month
    // AEDT: first Sunday in October - first Sunday in August
    // AEST: first Sunday in April - first Sunday in October
    // ??? Then what's the rest
    const today = "";
}