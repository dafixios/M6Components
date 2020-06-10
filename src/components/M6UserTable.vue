<template>
    <v-container grid-list-md >
        <v-layout row wrap>
            <v-flex xs8 />
            <v-flex xs4 >
                <v-text-field  v-model="searchTerms" label="search for a user" />
            </v-flex>
            <v-flex xs12 >
                <v-data-table
                    :headers="headers"
                    :items="filteredUsers"
                    class="elevation-1"
                    :pagination.sync="pagination"
                >
                    <template v-slot:items="props">
                        <td >{{ props.item.name }}</td>
                        <td >{{ props.item.email }}</td>
                        <td >
                            <v-chip 
                                color="indigo" 
                                text-color="white" 
                                close
                                v-for="(role, index) in props.item.roles"
                                :key="`chip-${index}`"
                                @input="removeChip(props.item.id, role.id)"
                            >
                                {{role.name}}
                            </v-chip>
                        </td>
                        <td>
                            <v-btn color="blue" flat icon small @click="showRolesModal(props.item)" >
                                <v-icon >edit</v-icon>
                            </v-btn>
                            <v-btn color="red" flat icon small @click="deleteUser(props.item.id)" >
                                <v-icon >delete</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
        <user-table-add 
            v-if="addUserRoles" 
            :show="addUserRoles" 
            :user="userTemp"
            @close="addUserRoles = false" 
        />
    </v-container>
</template>

<script>
import UserTableAdd from './UserTableAdd'
export default {
    components: {
        UserTableAdd
    },
    data: () => ({
        pagination:{
            rowsPerPage: 10
        },
        searchTerms: "",
        addUserRoles: false,
        userTemp: {},
        headers: [
            { text: 'User', value: 'user' },
            { text: 'Email', value: 'email' },
            { text: 'Roles', value: 'roles', sortable: false },
            { text: 'Actions' ,value: 'actions', sortable: false }
        ],
        users: [
            /*{ 
                id:"123123123", name: "Bob Smith", email: "bobsmith@sharp.com", 
                roles: [ { id: "123124", name: 'Admin'}, { id:"123123", name:'Marketer'} ] 
            }*/
        ]
    }),
    methods:{
        removeChip(userId, roleId){
            const tempUser = this.users.find( u => u.id === userId )
            const tempRoles = tempUser.roles.filter( r => r.id !== roleId )
            tempUser.roles = tempRoles
        },
        showRolesModal(user){
            this.userTemp = user
            this.addUserRoles = true
        },
        deleteUser(id){ 
            this.users = this.users.filter( u => u.id !== id )
        }
    },
    computed: {
        filteredUsers(){
            if( this.searchTerms ){
                return this.users.filter( u => u.name.toLowerCase().includes( this.searchTerms.toLowerCase() ) )
            }

            return this.users
        }
    }
}
</script>