'use strict'

exports.loginCustomerWithGoogle = async function (request, response) {
    const { GOOGLE_CLIENT_ID } = this.include('environments')
    const HtmlTemplate = this.include('statics', 'GoogleLogin')
    const html = HtmlTemplate
        .replace('{{YOUR_CLIENT_ID}}', GOOGLE_CLIENT_ID)
        .replace('{{HANDLER_URL}}', 'google/signin')
    response
        .type('text/html')
        .header("Set-Cookie", "HttpOnly;Secure;SameSite=Strict")
        .send(html)
}
