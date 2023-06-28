const axios = require("axios");
const config = require("config");
const identityProviderUrl = config.resourceApi.identityProviderUrl;
const {
    tokenService
} = require('../modules/shared/services');

const audience = 'RPS_API';
const issuer = 'RPS_ID';

const getNewAccessToken = async (accessToken, refreshToken) => {
    const response = await axios.get(`${identityProviderUrl}/token`, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            accesstoken: accessToken,
            refreshtoken: refreshToken
        }
    });

    const {accesstoken, refreshtoken} = response.headers
    return {accesstoken, refreshtoken}
}

const verifyAccessToken = (accessToken) => {
    try {
        return tokenService.verifyToken(accessToken);
    } catch (error) {
        throw new Error('Expired Access Token');
    }
}

const verifyRefreshToken = (refreshToken) => {
    try {
        return tokenService.verifyToken(refreshToken);
    } catch (error) {
        throw new Error('Invalid Refresh Token');
    }
}

const isUserDetailsValid = (accessData, refreshData) => {
    return accessData.user.username === refreshData.user.username
}

const isAccessTokenDetailsValid = (accessData) => {
    return accessData.aud === audience && accessData.iss === issuer;
}

const isRefreshTokenDetailsValid = (refreshData) => {
    return refreshData.aud === audience && refreshData.iss === issuer;
}

module.exports = {
    auth: async (req, res, next) => {
        const { accesstoken, refreshtoken } = req.headers
        try {
            const accessData = verifyAccessToken(accesstoken);
            const refreshData = verifyRefreshToken(refreshtoken);

            if (!isAccessTokenDetailsValid(accessData)) {
                throw new Error('Invalid Access Token')
            }
            if (!isRefreshTokenDetailsValid(refreshData)) {
                throw new Error('Invalid Refresh Token')
            }
            if (!isUserDetailsValid(accessData, refreshData)) {
                throw new Error('Invalid Creds')
            }
            res.locals.user = accessData.user;
            res.set('Authorization', 'Bearer '+ accesstoken)
            res.set('RefreshToken', 'BearerRef '+ refreshtoken)
            res.header("Access-Control-Expose-Headers","Authorization, RefreshToken");
        } catch (error) {
            try {
                if (error.message === 'Invalid Refresh Token' || error.message === 'Invalid Creds') {
                    throw new Error('Access has expired');
                }
                const refreshData = verifyRefreshToken(refreshtoken);
                if (isRefreshTokenDetailsValid(refreshData)) {
                    const data = await getNewAccessToken(accesstoken, refreshtoken)
                    const newAccessData = verifyAccessToken(data.accesstoken);
                    res.locals.user = newAccessData.user;
                    res.set('Authorization', 'Bearer '+ data.accesstoken)
                    res.set('RefreshToken', 'BearerRef '+data.refreshtoken)
                    res.header("Access-Control-Expose-Headers","Authorization, RefreshToken");
                    next()
                    
                }
            } catch (error) {
                return res.status(401).json({message: 'Access has expired'})
            }
            res.locals.user = null;
        }
        next();
    }
}