import {neon} from "@neondatabase/serverless";

export async function POST(request: Request) {
    try {
        const dbUrl = process?.env?.DATABASE_URL;

        if (!dbUrl) {
            return Response.json(
                {error: "DATABASE_URL not set in environment"},
                {status: 500}
            );
        }

        const sql = neon(dbUrl);
        const {name, email, clerk_id} = await request.json();

        if (!name || !email || !clerk_id) {
            return Response.json(
                {error: "Missing required fields"},
                {status: 400}
            );
        }

        // ✅ Check if user already exists by clerk_id
        const existingUser = await sql`
            SELECT *
            FROM users
            WHERE clerk_id = ${clerk_id}
        `;

        if (existingUser.length > 0) {
            return Response.json({
                user: existingUser[0],
                message: "User already exists",
                status: 200,
            });
        }

        // ✅ Insert if not exists
        const response = await sql`
            INSERT INTO users (name, email, clerk_id)
            VALUES (${name}, ${email}, ${clerk_id}) RETURNING *
        `;

        return Response.json({
            user: response[0],
            status: 201,
        });
    } catch (error) {
        console.log("❌ API Error:", error);
        return Response.json({
            error: "Internal Server Error",
            status: 500,
        });
    }
}
