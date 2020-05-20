<template>
  <div>
    <v-menu
      v-model="menu"
      v-resize="onResize"
      bottom
      :close-on-content-click="false"
      max-height="600"
      :min-width="minWidth"
      offset-y
      style="z-index: 999;"
    >
      <template v-slot:activator="{ on }">
        <v-btn
          icon
          v-on="on"
        >
          <v-avatar size="36px">
            <img
              :alt="profile.user.name"
              :src="getDefaultImageProfile()"
            >
          </v-avatar>
        </v-btn>
      </template>

      <v-card>
        <!-- Profile -->
        <v-list
          class="pb-0"
          two-line
        >
          <v-list-tile avatar>
            <v-list-tile-avatar color="primary">
              <img
                v-if="logo"
                :alt="profile.user.name"
                :src="getCompanySelected()"
              >
              <span
                v-else
                class="headline white--text"
              >
                {{ getImageFromString(profile.user.name) }}
              </span>
            </v-list-tile-avatar>

            <v-list-tile-content>
              <v-list-tile-title v-html="profile.user.name" />
<!--              <v-list-tile-sub-title>-->
<!--                <span class="grey&#45;&#45;text">-->
<!--                  {{-->
<!--                    isPersonalAccount-->
<!--                      ? 'Personal Account'-->
<!--                      : profile.user.companyName-->
<!--                  }}-->
<!--                </span>-->
<!--              </v-list-tile-sub-title>-->
            </v-list-tile-content>

            <v-list-tile-action class="v-list-action-center-fix">
<!--              <v-btn-->
<!--                :color="!isPersonalAccount ? 'grey' : 'red'"-->
<!--                flat-->
<!--                icon-->
<!--                @click="menuCompanies = !menuCompanies"-->
<!--              >-->
<!--                <v-icon>edit</v-icon>-->
<!--              </v-btn>-->
            </v-list-tile-action>
          </v-list-tile>
          <v-divider />
        </v-list>

        <v-list
          v-if="profile.joins.length"
          class="pa-0"
        >
          <v-subheader>Pending Approval</v-subheader>

          <template>
            <v-menu
              v-for="(company, index) in profile.joins"
              :key="index"
              left
              :max-width="tileWidth"
              offset-x
              open-on-hover
            >
              <template v-slot:activator="{ on }">
                <div v-on="on">
                  <v-list-tile
                    :key="index"
                    avatar
                    class="request-tile"
                    click=""
                  >
                    <v-list-tile-avatar
                      class="hidden-sm-and-down"
                      color="primary"
                    >
                      <v-img
                        v-if="company.image"
                        :alt="company.name"
                        :src="company.image"
                      />
                      <span
                        v-else
                        class="headline white--text"
                      >
                        {{ getImageFromString(company.name) }}
                      </span>
                    </v-list-tile-avatar>

                    <v-list-tile-content>
                      <v-list-tile-title v-html="company.name" />
                    </v-list-tile-content>
                  </v-list-tile>
                </div>
              </template>

              <v-list class="request-list-menu">
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title class="request-tile-title">
                      Wait for approval from
                      {{ company.administrator.first_name }}
                      {{ company.administrator.last_name }}
                    </v-list-tile-title>

                    <v-list-tile-sub-title class="request-tile-title">
                      <a
                        v-if="company.administrator"
                        :href="'mailto: ' + company.administrator.email"
                        style="color: #1976d2 !important;"
                      >
                        {{ company.administrator.email }}
                      </a>
                    </v-list-tile-sub-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-menu>
          </template>
        </v-list>

        <!-- Logout and add company -->
        <v-list>
          <v-divider v-if="profile.joins.length" />

          <v-list-tile>
            <v-list-tile-action>
              <v-tooltip bottom>
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="grey"
                    flat
                    v-on="on"
                    @click.prevent="dialogLogout = true"
                  >
                    Logout
                  </v-btn>
                </template>
                <span>Click to Logout</span>
              </v-tooltip>
            </v-list-tile-action>

            <v-list-tile-content>
              <v-spacer />
            </v-list-tile-content>

            <v-list-tile-action>
<!--              <v-btn-->
<!--                color="blue"-->
<!--                flat-->
<!--                @click="$router.push('/join/company')"-->
<!--              >-->
<!--                <v-icon>add</v-icon>-->
<!--                Add Company-->
<!--              </v-btn>-->
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-card>
    </v-menu>

    <v-dialog
      v-model="menuCompanies"
      content-class="menuCompanies"
      max-width="560"
      persistent
      scrollable
    >
      <v-card>
        <v-toolbar style="background: #006699; color:#fff">
          <v-toolbar-title style="font-size: 14px;">
            My Company Accounts
          </v-toolbar-title>
          <v-spacer />
          <v-btn
            color="white"
            flat
            @click="$router.push('/join/company')"
          >
            <v-icon>add</v-icon>
            Add Company
          </v-btn>
        </v-toolbar>
        <v-card-text style="max-height:300px;">
          <v-list class="pa-0">
            <template v-if="profile.companies.length">
              <template v-for="(company, index) in profile.companies">
                <v-list-tile
                  :key="index"
                  avatar
                  :class="{ 'active-tile': company.active }"
                  @click="selectCompany(company)"
                >
                  <v-tooltip
                    :key="'company_' + index"
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <v-list-tile-avatar
                        class="hidden-sm-and-down"
                        color="primary"
                        v-on="on"
                      >
                        <v-img
                          v-if="company.image"
                          :alt="company.name"
                          :src="company.image"
                        />
                        <span
                          v-else
                          class="headline white--text"
                        >
                          {{ getImageFromString(company.name) }}
                        </span>
                      </v-list-tile-avatar>

                      <v-list-tile-content v-on="on">
                        <v-list-tile-title v-html="company.name" />
                      </v-list-tile-content>
                    </template>
                    <span>
                      {{
                        company.active ? 'Active' : 'Select to change account'
                      }}
                    </span>
                  </v-tooltip>

                  <v-list-tile-action class="v-list-action-center-fix">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <router-link
                          color="grey"
                          :to="{
                            name: 'companies.showNew2',
                            params: { id: company.nid }
                          }"
                        >
                          <v-btn
                            class="buttonIconCompaniesList ma-0 pa-0"
                            color="grey"
                            flat
                            icon
                            v-on="on"
                          >
                            <v-icon>edit</v-icon>
                          </v-btn>
                        </router-link>
                      </template>
                      <span>Edit Company</span>
                    </v-tooltip>
                  </v-list-tile-action>

                  <v-list-tile-action
                    v-if="!isPersonalAccount && company.isAdmin"
                    class="v-list-action-center-fix"
                  >
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn
                          class="buttonIconCompaniesList ma-0 pa-0"
                          color="grey"
                          flat
                          :href="company.person"
                          icon
                          v-on="on"
                        >
                          <v-icon color="grey">
                            person
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Manage People</span>
                    </v-tooltip>
                  </v-list-tile-action>

                  <v-list-tile-action class="v-list-action-center-fix">
                    <v-tooltip
                      v-if="!companyLoader"
                      bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          class="buttonIconCompaniesList ma-0 pa-0"
                          color="grey"
                          flat
                          icon
                          v-on="on"
                          @click.prevent.stop="updateCompanyShow(company)"
                        >
                          <v-icon v-if="company.show">
                            check_box
                          </v-icon>
                          <v-icon v-else>
                            check_box_outline_blank
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Display to Public</span>
                    </v-tooltip>
                    <v-btn
                      v-else
                      class="buttonIconCompaniesList ma-0 pa-0"
                      color="grey"
                      flat
                      icon
                    >
                      <v-progress-circular indeterminate />
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
                <v-divider
                  :key="'divider_' + index"
                  class="ma-1"
                />
              </template>
            </template>
            <template v-else>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    There are no companies
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card-text>

        <!-- Accounts -->
        <v-toolbar style="background: #006699; color:#fff">
          <v-toolbar-title style="font-size: 14px;">
            Personal Account
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-list class="pa-0">
            <template v-if="profile.accounts.length">
              <template v-for="(account, index) in profile.accounts">
                <v-list-tile
                  :key="index"
                  avatar
                  :class="{ 'active-tile': account.active }"
                  @click="selectCompany(account)"
                >
                  <v-tooltip
                    :key="'account_' + index"
                    bottom
                  >
                    <template v-slot:activator="{ on }">
                      <v-list-tile-avatar
                        class="hidden-sm-and-down"
                        color="primary lighten-2"
                        v-on="on"
                      >
                        <v-img
                          v-if="account.image"
                          :alt="account.name"
                          :src="account.image"
                        />
                        <span
                          v-else
                          class="headline white--text"
                        >
                          {{ getImageFromString(account.name) }}
                        </span>
                      </v-list-tile-avatar>

                      <v-list-tile-content v-on="on">
                        <v-list-tile-title v-html="account.name" />
                      </v-list-tile-content>
                    </template>
                    <span>
                      {{
                        account.active ? 'Active' : 'Select to change account'
                      }}
                    </span>
                  </v-tooltip>

                  <v-list-tile-action class="v-list-action-center-fix">
                    <v-tooltip
                      v-if="!companyLoader"
                      bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          class="ma-0 pa-0"
                          color="grey"
                          flat
                          icon
                          v-on="on"
                          @click.prevent="goToProfileEdit"
                        >
                          <v-icon color="grey">
                            edit
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Edit Profile</span>
                    </v-tooltip>
                  </v-list-tile-action>

                  <v-list-tile-action class="v-list-action-center-fix">
                    <v-tooltip
                      v-if="!companyLoader"
                      bottom
                    >
                      <template v-slot:activator="{ on }">
                        <v-btn
                          class="buttonIconCompaniesList ma-0 pa-0"
                          color="grey"
                          flat
                          icon
                          v-on="on"
                          @click.prevent.stop="updateCompanyShow(account)"
                        >
                          <v-icon v-if="account.show">
                            check_box
                          </v-icon>
                          <v-icon v-else>
                            check_box_outline_blank
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Display to Public</span>
                    </v-tooltip>
                    <v-btn
                      v-else
                      class="buttonIconCompaniesList ma-0 pa-0"
                      color="grey"
                      flat
                      icon
                    >
                      <v-progress-circular indeterminate />
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </template>
            </template>
            <template v-else>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>
                    There are no accounts
                  </v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>
          </v-list>
        </v-card-text>
        <v-divider class="ma-1" />
        <v-card-actions>
          <v-spacer />
          <v-btn
            :disabled="btnDisabled"
            flat
            @click="changeCompany"
          >
            {{ apply ? 'Loading...' : 'Apply' }}
          </v-btn>
          <v-btn
            color="error"
            :disabled="apply"
            flat
            @click="menuCompanies = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="dialogLogout"
      max-width="290"
    >
      <v-card>
        <v-card-text>
          Are you sure to logout?
        </v-card-text>

        <v-card-actions>
          <v-spacer />

          <v-btn
            flat="flat"
            @click="dialogLogout = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="primary"
            flat="flat"
            href="/user/logout"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: 'M6Profile',
  props: {
    defaultImage: {
      type: String,
      default:
        '/sites/all/themes/m6connect/images/messanger_icons/fa-user-icon.png'
    },
    profile: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      menu: false,
      companyLoader: false,
      windowSize: {
        x: 0
      },
      minWidth: 500,
      tileWidth: 300,
      dialogLogout: false,
      menuCompanies: false,
      btnDisabled: true,
      companySelected: false,
      apply: false
    }
  },
  computed: {
    isPersonalAccount() {
      return this.profile.accounts.find(row => row.active)
    },
    logo() {
      const find = this.profile.companies.find(row => row.active)
      if (find) {
        if (find.image) {
          return true
        }
        return false
      } else {
        const find = this.profile.accounts.find(row => row.active)
        if (find) {
          return true
        }
        return false
      }
    }
  },
  mounted() {
    this.onResize()
  },
  methods: {
    selectCompany(company) {
      this.profile.companies.map(row => {
        row.active = false
        return row
      })
      this.profile.accounts.map(row => {
        row.active = false
        return row
      })

      company.active = true
      this.companySelected = company
      this.btnDisabled = false
    },
    changeCompany() {
      this.apply = true
      this.axios
        .post(this.companySelected.swap || this.companySelected.to)
        .then(() => {
          this.apply = false
          this.profile.user.companyName = this.companySelected.name
          location.reload()
        })
        .catch(err => {
          this.apply = false
          this.profile.user.companyName = this.companySelected.name
          location.reload()
        })
    },
    goToProfileEdit() {
      this.$router
        .replace({
          name: 'userProfileDetail',
          params: { id: this.profile.user.uid }
        })
        .catch(err => {
          console.error(err)
        })
    },
    updateCompanyShow(company) {
      this.companyLoader = true
      this.menuCompanies = true
      this.axios
        .post('m6-platform/update/companies', { nid: company.nid })
        .then(response => {
          company.show = response.data.mode
          this.companyLoader = false
        })
    },
    getDefaultImageProfile() {
      let src = this.defaultImage
      if (this.profile.user.image) {
        src = this.profile.user.image
      }
      return src
    },
    getCompanySelected() {
      const find = this.profile.companies.find(row => row.active)
      if (find) {
        return find.image
      }
      let src = this.defaultImage
      if (this.profile.user.image) {
        src = this.profile.user.image
      }
      return src
    },
    getImageFromString(name) {
      return name.charAt(0)
    },
    onResize() {
      this.windowSize = { x: window.innerWidth }
      this.minWidth = 320

      if (this.windowSize.x < 768) {
        this.minWidth = 280
      }
    }
  }
}
</script>

<style scoped>
.stringImage {
  width: 40px;
  border-radius: 50%;
  background: #00aeef;
  font-size: 30px;
  color: #fff;
  text-align: center;
}

.buttonIconCompaniesList {
}

.v-list-action-center-fix {
  justify-content: center !important;
}
.active-tile {
  background: #b3e5fc;
}
.request-tile {
  color: grey;
}

.v-list.request-list-menu.theme--light {
  padding: 0;
}

.v-list__tile__title.request-tile-title {
  font-size: 14px;
}
.v-btn--active:before,
.v-btn:hover:before,
.v-btn:focus:before {
  background-color: #666;
}
</style>
