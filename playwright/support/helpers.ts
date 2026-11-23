export function formatDate(date: string): string {
    const MONTHS = [
        'jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.',
        'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'
    ]
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date)
    if (!match) {
        throw new Error(`Invalid format: "${date}". Use YYYY-MM-DD.`)
    }

    const year = Number(match[1])
    const month = Number(match[2])
    const day = Number(match[3])

    const d = new Date(Date.UTC(year, month - 1, day))
    if (d.getUTCMonth() !== month - 1 || d.getUTCDate() !== day) {
        throw new Error(`Nonexistent date: "${date}".`)
    }

    return `${day} de ${MONTHS[month - 1]} de ${year}`
}
