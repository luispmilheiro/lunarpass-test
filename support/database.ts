import { Pool } from 'pg'
import { Kysely, PostgresDialect, CamelCasePlugin } from 'kysely'

import type { Mission, Reservation, Ticket } from './types'

interface Database {
    missions: Mission,
    reservations: Reservation,
    tickets: Ticket
}

const dialect = new PostgresDialect({
    pool: new Pool({
        connectionString: 'postgresql://postgres.pkuukuruicnylntmlvbg:Gkg9ViH7cVMTW31f@aws-0-us-east-1.pooler.supabase.com:5432/postgres',
        ssl: {
            rejectUnauthorized: false,
        },
    })
})

export const db = new Kysely<Database>({
    dialect,
    plugins: [new CamelCasePlugin()]
})

// ---- missions ----
export async function cleanMission(mission: Mission) {
    await deleteReservations(mission.id)
    await deleteTickets(mission.id)
    await deleteMission(mission.id)
}

export async function cleanAndInsertMission(mission: Mission) {
    await cleanMission(mission)
    await insertMission(mission)
}

export async function insertMission(mission: Mission) {
    await db.insertInto('missions').values({
        id: mission.id,
        rocket: mission.rocket,
        baseId: mission.baseId,
        departureDate: mission.departureDate,
        returnDate: mission.returnDate,
        price: mission.price
    }).execute()
}

export async function deleteMission(id: string) {
    await db.deleteFrom('missions').where('id', '=', id).execute()
}

// ---- reservations ----
export async function deleteReservations(missionId: string) {
    await db.deleteFrom('reservations').where('missionId', '=', missionId).execute()
}

// ---- tickets ----
export async function deleteTickets(missionId: string) {
    await db.deleteFrom('tickets').where('missionId', '=', missionId).execute()
}
