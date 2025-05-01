export async function POST(req) {
    try {
        // This API doesn't really need to do much server-side since JWT is stateless
        // But we can respond to the client to confirm the logout

        return new Response(JSON.stringify({
            message: 'Logout successful',
        }), { status: 200 });
        
    } catch (error) {
        console.error('Logout error:', error);
        return new Response(JSON.stringify({ message: 'Logout failed', error: error.message }), { status: 500 });
    }
}
