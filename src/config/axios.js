export default {
  firestoreApiUrl: process.env.VUE_APP_FIRESTORE_API,
  config: {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    }
  }
}
