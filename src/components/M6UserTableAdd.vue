<template>
    <div class="text-xs-center">
        <v-dialog
            v-model="show"
            width="650"
            persistent
        >

      <v-card>
        <v-card-title
          class="headline indigo darken-2 white--text"
          primary-title
        >
          User Roles for: {{ user.name }}
        </v-card-title>
        
        <v-card-text>
            <v-select
                v-model="user.roles"
                item-value="id"
                item-text="name"
                return-object
                :items="roles"
                label="Standard"
                multiple
                chips
            />
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-2"
            flat
            @click="$emit('close')"
          >
            close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    </div>
</template>

<script>
export default {
    props:{
        show:{
            type: Boolean,
            default: false
        },
        user: {
            type: Object,
            default: () => {}
        }
    },
    data: () => ({
        roles: [
            /*{ id: "123124", name: 'Admin'} */
        ]
    }),
}
</script>