// clear cookies and redirect to home page
export async function GET() {
    const headers = new Headers();

    // Expire cookies (clear access and refresh tokens)
    const expiredAttrs = 'Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax';
    headers.append('Set-Cookie', `access_token=; ${expiredAttrs}`);
    headers.append('Set-Cookie', `refresh_token=; ${expiredAttrs}`);

    // redirect to home
    headers.set('Location', '/');

    return new Response(null, {
        status: 302,
        headers
    });
}