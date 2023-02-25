const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '584035773296-bsig9atogt31ki2sfmg07pb10ls7h07p.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'http://localhost:5173/auth/start';

const oAuth2Client = new OAuth2Client(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

const SCOPES = ['https://www.googleapis.com/auth/bigquery'];

function getAuthUrl() {
  return oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
}

async function getAccessTokenFromCode(code) {
  const { tokens } = await oAuth2Client.getToken(code);
  return tokens.access_token;
}

module.exports = {
  getAuthUrl,
  getAccessTokenFromCode,
};
  