
// Import dependencies
const express = require('express');
const CredentialMiddleware = require('../../middleware/CredentialMiddleware')

// import middleware
const { onRequest, sendSuccess, sendError } = require('../../middleware/HTTPMiddleware')
// const { verifyIdTokenGoogle, signIn } = require('../../middleware/GoogleAccountMiddleware')
const credential = new CredentialMiddleware();

// Create router
const router = express.Router();
// router.post('/google/verifyIdToken', onRequest, verifyIdTokenGoogle, sendSuccess, sendError);
// router.post('/google/signIn', onRequest, signIn, sendSuccess, sendError);

router.post('/credential/signin', onRequest, credential.signIn, sendSuccess, sendError);
router.post('/credential/signup', onRequest, credential.signUp, sendSuccess, sendError);
router.post('/credential/verifyToken', onRequest, credential.verifyToken, sendSuccess, sendError);

module.exports = router;
