import annualRevenue from './settings-global-annual-revenue'
import certifications from './settings-global-certifications'
import companyTypes from './settings-global-company-types'
import diversityCredentials from './settings-global-diversity-credentials'
import naics from './settings-global-naics'
import diversity from './settings-global-diversity-credentials'
import projectSizeCapable from './settings-global-project-size-capable'
import productsAndServices from './settings-global-products-and-services'
import projectStatus from './settings-global-project-status'
import regions from './settings-global-regions'

export default {
  namespaced: true,
  modules: {
    annualRevenue,
    certifications,
    companyTypes,
    diversityCredentials,
    naics,
    diversity,
    projectSizeCapable,
    productsAndServices,
    regions,
    projectStatus
  }
}
