import algoliasearch from 'algoliasearch'

// TODO: Store App ID and API Key in Drupal variable
const client = algoliasearch('DHC7BSF993', '3337d03724f42804d457ba5366854fac')

const companies = client.initIndex('m6companies')

export { companies }
