import annualRevenue from './companies-settings-data-annual-revenue'
import certifications from './companies-settings-data-certifications'
import naics from './companies-settings-data-naics'
import projectSizeCapable from './companies-settings-data-project-size-capable'
import regions from './companies-settings-data-regions'
import productsServices from './companies-settings-data-products-services.js'

export default {
  namespaced: true,
  modules: {
    annualRevenue,
    certifications,
    naics,
    projectSizeCapable,
    regions,
    productsServices
  }
}
