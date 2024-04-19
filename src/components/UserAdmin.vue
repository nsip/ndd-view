<template>
    <div class="tbl">
        <Vue3EasyDataTable :headers="headers" :items="items" class="table" @click-row="Modal" alternating :fixed-header="true" />
    </div>
</template>

<!-- =============================================================================== -->

<script setup lang="ts">

import eventBus from '@/share/util';
import { useOverlayMeta, renderOverlay } from '@unoverlays/vue'
import { notify } from "@kyvg/vue3-notification";
import { getUserInfoList, getUserOnline, putUserUpdate, delUser, putResetUserPWD, globalMsg } from "@/share/share";
import type { Header, Item } from "vue3-easy-data-table";
import Vue3EasyDataTable from "vue3-easy-data-table";
import "vue3-easy-data-table/dist/style.css";
import UserEditModal from '@/components/modal-components/UserEdit.vue'
import CCModal from '@/components/modal-components/CCModal.vue'

const TableHeight = ref((window.innerHeight * 0.8).toString() + "px");
const headers = ref<any>(null);
const items = ref<any>(null);

headers.value = [
    { text: "USER", value: "user", sortable: true },
    { text: "EMAIL", value: "email" },
    { text: "ADMIN", value: "admin", sortable: true },
    { text: "ONLINE", value: "online", sortable: true },
    { text: "ACTIVE", value: "active", sortable: true },
    { text: "JOINED", value: "joined", sortable: true }
];
items.value = [
    // { user: "", email: "", admin: "", online: "", active: "" },
];

const reloadTable = async () => {

    items.value = []
    let users: { [x: string]: any; }[] | null

    {
        const de = await getUserInfoList('', '');
        if (de.error != null) {
            notify({
                title: "Error: User Info List",
                text: de.error,
                type: "error"
            })
            return
        }
        users = de.data
        if (users == null) {
            return null
        }
    }
    {
        const de = await getUserOnline();
        if (de.error != null) {
            notify({
                title: "Error: User Online List",
                text: de.error,
                type: "error"
            })
            return
        }
        const online = de.data
        if (online == null) {
            return null
        }

        const onlineUsers: string[] = []
        online.forEach((online: { [x: string]: any }) => {
            // console.log(online);
            onlineUsers.push(online['Uname'])
        });

        users.forEach((user: { [x: string]: any }) => {
            // console.log(user);

            const uname = user["uname"];
            const email = user["email"];
            const active = user["active"];
            const admin = user["role"];
            const joined = (user["regtime"] as string).substring(0, 10); // only retrieve YYYY-MM-DD

            items.value.push({
                user: uname,
                email: email,
                admin: admin == "admin" ? true : false,
                online: onlineUsers.includes(uname),
                active: active,
                joined: joined,
            });
        });
    }

    globalMsg.value = `Dictionary has ${items.value.length} registered users`
}

onMounted(() => {
    reloadTable()
    eventBus.on('reload-table', async (msg) => {
        await reloadTable()
    })
})

type ClickRowArgument = Item & {
    isSelected?: boolean;
    indexInCurrentPage?: number;
};

// for simulate double click
// let t = 0;
// let got1st = false;
// const interval = 300;

// double click effect only
// const rowDbClick = (item: ClickRowArgument) => {
//     if (got1st && Date.now() - t > interval) {
//         got1st = false;
//     }
//     if (!got1st) {
//         t = Date.now();
//         got1st = true;
//     } else {
//         if (Date.now() - t <= interval) {
//             rowClick(item);
//         }
//         got1st = false;
//     }
// };

// click real action
const Modal = async (item: ClickRowArgument) => {
    // console.log(item);

    if (item['online']) {
        notify({
            title: "Notice: Admin User",
            text: "online user cannot be set",
            type: "warn"
        })
        return
    }

    try {
        // result is a struct {...}, updated user
        const result = await renderOverlay(UserEditModal, {
            props: {
                uname: item['user'],
                admin: item['admin'],
                active: item['active']
            },
        })
        // console.log(":::", result)

        const uname = item['user'];

        if ((result as any).delete) { // if [delete] set is true

            // delete user with confirmation
            try {
                if (String(await renderOverlay(CCModal, {
                    props: {
                        text: `remove user '${uname}' permanently?`,
                        fontsize: "14px",
                        width: "450px",
                        height: "85px",
                    },
                })) === 'confirm') {
                    const de = await delUser(uname)
                    if (de.error != null) {
                        notify({
                            title: "Error: Delete User",
                            text: de.error,
                            type: "error"
                        })
                        return
                    }
                }
            } catch (e) {
                switch (e) {
                    case 'cancel':
                        break
                }
            }

        } else { // other setting

            // set other properties & password confirmation
            try {

                const admin = (result as any).admin as string
                const active = (result as any).active as boolean
                const pwd = (result as any).pwd as string

                let confirmation = `[${uname}]\n\n\tADMIN => ${admin}\t\t\t\tACTIVE => ${active}`
                if (pwd.trim().length > 0) {
                    confirmation += `\n\n\tPASSWORD => ${pwd}`
                }
                if (String(await renderOverlay(CCModal, {
                    props: {
                        text: confirmation,
                        fontsize: "13px",
                        width: "450px",
                        height: "180px",
                    },
                })) === 'confirm') {

                    if (pwd.trim().length > 0) {
                        const de = await putResetUserPWD(uname, pwd)
                        if (de.error != null) {
                            notify({
                                title: "Error: Reset Password",
                                text: de.error,
                                type: "error"
                            })
                            return
                        }
                    }

                    const de = await putUserUpdate(uname, result)
                    if (de.error != null) {
                        notify({
                            title: "Error: Update User",
                            text: de.error,
                            type: "error"
                        })
                        return
                    }
                }
            } catch (e) {
                switch (e) {
                    case 'cancel':
                        break
                }
            }
        }

        await reloadTable()

    } catch (e) {
        switch (e) {
            case 'cancel':
                break
        }
    }
};

////////////////////////////////////////////////////////////

// headers.value = [
//     { text: "PLAYER", value: "player" },
//     { text: "TEAM", value: "team" },
//     { text: "NUMBER", value: "number" },
//     { text: "POSITION", value: "position" },
//     { text: "HEIGHT", value: "indicator.height" },
//     { text: "WEIGHT (lbs)", value: "indicator.weight", sortable: true },
//     { text: "LAST ATTENDED", value: "lastAttended", width: 200 },
//     { text: "COUNTRY", value: "country" },
// ];
// items.value = [
//     { player: "Stephen Curry", team: "GSW", number: 30, position: 'G', indicator: { "height": '6-2', "weight": 185 }, lastAttended: "Davidson", country: "USA" },
//     { player: "Lebron James", team: "LAL", number: 6, position: 'F', indicator: { "height": '6-9', "weight": 250 }, lastAttended: "St. Vincent-St. Mary HS (OH)", country: "USA" },
//     { player: "Kevin Durant", team: "BKN", number: 7, position: 'F', indicator: { "height": '6-10', "weight": 240 }, lastAttended: "Texas-Austin", country: "USA" },
//     { player: "Giannis Antetokounmpo", team: "MIL", number: 34, position: 'F', indicator: { "height": '6-11', "weight": 242 }, lastAttended: "Filathlitikos", country: "Greece" },
// ];
</script>

<!-- =============================================================================== -->

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.tbl {
    margin: auto;
    width: 90%;
    /* border: 3px solid green; */
    /* padding: 10px; */
}

.table {
    margin-top: 1%;
    max-height: v-bind("TableHeight");
    overflow-y: auto;
}
</style>
