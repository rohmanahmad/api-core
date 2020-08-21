'use strict'

exports.loginCustomerWithGoogle = async function (request, response) {
    const {handler_url: handlerUrl, is_component} = request.query
    const { GOOGLE_CLIENT_ID } = this.include('environments')
    const HtmlTemplate = this.include('statics', 'GoogleLogin')
    let html = HtmlTemplate
        .replace('{{YOUR_CLIENT_ID}}', GOOGLE_CLIENT_ID)
        .replace('{{HANDLER_URL}}', handlerUrl)
    if (is_component === 'yes') {
        const component = html.match(/<body>(.*?)<\/body>/is)
        if (component && component[0]) html = component[1].replace(new RegExp('<body>|</body>'), '')
    }
    response
        .type('text/html')
        .header("Set-Cookie", "HttpOnly;Secure;SameSite=Strict")
        .send(html)
}
