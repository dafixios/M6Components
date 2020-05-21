import certifications from './companies-data-certifications'
import companyTypes from './companies-data-company-types'
import customer from './companies-data-customer'
import general from './companies-data-general'
import locations from './companies-data-locations'
import naics from './companies-data-naics'
import neededProductsServices from './companies-data-needed-products-services'
import providedProductsServices from './companies-data-provided-products-services'
import regions from './companies-data-regions'
import rfp from './companies-data-rfp'
import vendor from './companies-data-vendor'

export default {
  namespaced: true,
  modules: {
    certifications,
    companyTypes,
    customer,
    general,
    locations,
    naics,
    neededProductsServices,
    providedProductsServices,
    regions,
    rfp,
    vendor
  }
}
