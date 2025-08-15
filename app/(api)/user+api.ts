import {neon} from '@neondatabase/serverless';

export async function POST(request: Request) {
    try {
        const sql = neon(`${process.env.DATABASE_URL}`);
        const {name, email, clerk_id} = await request.json();

        if (!name || !email || !clerk_id) {
            return Response.json(
                {error: "Missing required fields"},
                {status: 400});
        }

        // ✅ Check if user already exists
        const existingUser = await sql`
            SELECT *
            FROM users
            WHERE email = ${email}
        `;

        if (existingUser.length > 0) {
            return Response.json({
                message: "User already exists",
                status: 200,
            });
        }

        // ✅ Insert if not exists
        const response = await sql`
            INSERT INTO users(name, email, clerk_id)
            VALUES (${name}, ${email}, ${clerk_id})
        `;

        return new Response(JSON.stringify({
            data: response,
            status: 201,
        }));

    } catch (error) {
        console.log("❌ API Error:", error);
        return Response.json({
            error: "Internal Server Error",
            status: 500,
        });
    }
}
