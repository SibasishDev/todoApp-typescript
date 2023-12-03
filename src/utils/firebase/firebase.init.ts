import * as admin from 'firebase-admin';
import ServiceAccount  from "../firebase/firebase-service.account.json";

admin.initializeApp({
    credential : admin.credential.cert(ServiceAccount as admin.ServiceAccount),
    storageBucket: 'gs://chattapplication-2c009.appspot.com'
});


export const bucket = admin.storage().bucket();
