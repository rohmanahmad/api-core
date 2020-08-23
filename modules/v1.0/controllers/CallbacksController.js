'use strict'

exports.googleSignin = async function (request, response) {
    const { GOOGLE_CLIENT_ID } = this.include('environments')
    const {email, fullname, token: googleToken} = request.body
    const GoogleAuthHelper = this.include('helpers', 'GoogleAuthHelper')
    const UserAccountsService = this.include('services', 'UserAccountsService')
    const UserTokensService = this.include('services', 'UserTokensService')
    const isValid = await GoogleAuthHelper(this).check({clientid: GOOGLE_CLIENT_ID, token: googleToken})
    debugger
    // tinggal logic untuk ambil semua data yg diperlukan. gunakan service untuk mengambilnya, sehingga user yg menggunakan login user:password juga jadi satu function
    const userInformation = await UserAccountsService(this).getInformation({email}) // menggunakan email krn login pakai google auth
    if (userInformation) {
        let information = {}
        information['user'] = userInformation
        information['token'] = await UserTokensService(this).getToken({userdata: userInformation})
        if (!information['user']) 
        response.send(information)
    } else {
        // user new
        response.send({
            need_register: true,
            token: null,
            user: {
                id: null,
                user_email: email,
                fullname: fullname,
                partner_data: null
            }
        })
    }
}