// import {auth} from "@clerk/nextjs/server";
// import {neon} from "@neondatabase/serverless";
//
// // ✅ Setup Neon
// const sql = neon(process.env.DATABASE_URL!);
//
// // ✅ POST: Add a favorite
// export async function POST(req: Request) {
//     try {
//         const {userId} = auth();
//         if (!userId) return Response.json({error: "Unauthorized"}, {status: 401});
//
//         const {name, address, lat, lng, marker_type} = await req.json();
//
//         if (!name || !lat || !lng) {
//             return Response.json({error: "Missing required fields"}, {status: 400});
//         }
//
//         // Get the user record
//         const [user] = await sql`SELECT id
//                                  FROM users
//                                  WHERE clerk_id = ${userId}`;
//         if (!user) {
//             return Response.json({error: "User not found"}, {status: 404});
//         }
//
//         const [favorite] = await sql`
//             INSERT INTO favorites (user_id, name, address, lat, lng, marker_type)
//             VALUES (${user.id}, ${name}, ${address}, ${lat}, ${lng}, ${marker_type}) RETURNING *
//         `;
//
//         return Response.json({favorite}, {status: 201});
//     } catch (error) {
//         console.error("❌ POST Favorites Error:", error);
//         return Response.json({error: "Internal Server Error"}, {status: 500});
//     }
// }
//
// // ✅ GET: Fetch all favorites for logged in user
// export async function GET() {
//     try {
//         const {userId} = auth();
//         if (!userId) return Response.json({error: "Unauthorized"}, {status: 401});
//
//         const [user] = await sql`SELECT id
//                                  FROM users
//                                  WHERE clerk_id = ${userId}`;
//         if (!user) return Response.json({favorites: []}, {status: 200});
//
//         const favorites = await sql`SELECT *
//                                     FROM favorites
//                                     WHERE user_id = ${user.id}`;
//
//         return Response.json({favorites}, {status: 200});
//     } catch (error) {
//         console.error("❌ GET Favorites Error:", error);
//         return Response.json({error: "Internal Server Error"}, {status: 500});
//     }
// }
//
// // ✅ DELETE: Remove a favorite
// export async function DELETE(req: Request) {
//     try {
//         const {userId} = auth();
//         if (!userId) return Response.json({error: "Unauthorized"}, {status: 401});
//
//         const {id} = await req.json();
//         if (!id) return Response.json({error: "Missing favorite id"}, {status: 400});
//
//         // Ensure favorite belongs to user
//         const [user] = await sql`SELECT id
//                                  FROM users
//                                  WHERE clerk_id = ${userId}`;
//         if (!user) return Response.json({error: "User not found"}, {status: 404});
//
//         await sql`DELETE
//                   FROM favorites
//                   WHERE id = ${id}
//                     AND user_id = ${user.id}`;
//
//         return Response.json({message: "Favorite deleted"}, {status: 200});
//     } catch (error) {
//         console.error("❌ DELETE Favorites Error:", error);
//         return Response.json({error: "Internal Server Error"}, {status: 500});
//     }
// }
