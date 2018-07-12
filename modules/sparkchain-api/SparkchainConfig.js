/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */
module.exports = {

    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    api: {
        "url": "https://dapi.sparkchain.cn",
        "version": "/v1",
        "appid": "1007122359636721664",//应用APPID
        "appsecret": "69a08656-5eea-45f8-a029-dfd95230fabf",//应用APPSECRET
        "srcAccount": "jaUnU6gXAczMW5wUbLe3jhkm8YkE15g7fR",//源头账户地址
        "srcSecret": "654321",//源头支付密码
        "destAccount": "jGiWefivwiapD5mAKAVy14U4W8hCFfBDB9"//目标账户地址
    },

    content: {
        "objCount": 5
    }
};
