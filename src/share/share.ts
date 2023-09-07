import { fetchNoBody, fetchBodyForm, mEmpty, fetchErr } from "@/share/fetch";
import { entityType } from "@/share/Entity";
import { collectionType } from "@/share/Collection";
import { URL_SIGN } from "./ip";

//////////////////////////////////////////////////////////////////////////////////////

export const loginUser = ref("");
export const loginToken = ref(""); // without 'Bearer '
export const loginAuth = ref(""); // with 'Bearer '
export const loginAsAdmin = ref(false)
export const Mode = ref("normal"); // 'normal' or 'approval', or 'admin'
export const ModalOn = ref(false) // indicates Modal Window is appearing
export const selType = ref(""); // which type of current selection, 'entity' or 'collection'
export const selItem = ref(""); // item name is currently selected
export const selEntity = reactive(new entityType()); // entity content
export const selCollection = reactive(new collectionType()); // collection content
export const aim = ref(""); // what item want to be search
export const lsEntity = ref([]); // name list of entity
export const lsCollection = ref([]); // name list of collection
export const selClsPath = ref([]); // current selected item's class path
export const selChildren = ref([]); // current selected item's children
export const lsSubscribed = ref([]); // subscribed item name list

//////////////////////////////////////////////////////////////////////////////////////

const onExpired = async () => {
    alert("session expired, redirecting to sign page")
    location.replace(`${URL_SIGN}`)
}

//////////////////////////////////////////////////////////////////////////////////////

export const getPing = async () => {
    const rt = await fetchNoBody(`/api/system/ver`, "GET", mEmpty, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

// fill loginUser

export const getSelfName = async () => {
    const rt = await fetchNoBody("api/user/auth/uname", "GET", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getUserInfoList = async (uname: string, fields: string) => {
    // means list all fields. 
    // swagger 'Try' uses '{fields}' as empty path param, so we intentionally use this literal string
    if (fields == undefined || fields == null || fields.length == 0) {
        fields = "{fields}";
    }
    const mQuery = new Map<string, any>([
        ["uname", uname],
    ]);
    const rt = await fetchNoBody(`api/admin/user/list/${fields}`, "GET", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getUserOnline = async () => {
    const rt = await fetchNoBody(`api/admin/user/online`, "GET", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

// export const isUserOnline = async (uname: string) => {
//     const online: string[] = await getUserOnline()
//     return online.includes(uname)
// }

export const postUserNew = async (uname: string, email: string, password: string) => {
    const mForm = new Map<string, any>([
        ["uname", uname],
        ["email", email],
        ["pwd", password],
    ]);
    const mQuery = new Map<string, any>([
        ["verify", false],
    ])
    const rt = await fetchBodyForm(`api/user/pub/sign-up`, "POST", mQuery, mForm, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const putUserUpdate = async (uname: string, data: any) => {
    const fields = 'Active,SysRole' // => struct field name;
    const mForm = new Map<string, any>([
        ["uname", uname],
        ["SysRole", data.admin ? "admin" : ""],
        ["Active", data.active]
    ]);
    const rt = await fetchBodyForm(`api/admin/user/update/${fields}`, "PUT", mEmpty, mForm, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const delUser = async (uname: string) => {
    const rt = await fetchNoBody(`api/admin/user/remove/${uname}`, "DELETE", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const putLogout = async () => {
    const rt = await fetchNoBody(`/api/user/auth/sign-out`, `PUT`, mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

//////////////////////////////////////////////////////////////////////////////////////

export const getItemKind = async (name: string, dbCol: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["dbcol", dbCol],
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/kind`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getContent = async (name: string, dbCol: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["dbcol", dbCol],
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/one`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getColEntities = async (name: string) => {
    const mQuery = new Map<string, any>([
        ["colname", name]
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/colentities`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getClsInfo = async (name: string) => {
    const mQuery = new Map<string, any>([
        ["entname", name]
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/entclasses`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getList = async (kind: string, dbCol: string) => {
    const mQuery = new Map<string, any>([
        ["dbcol", dbCol]
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/list/${kind}`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getSearch = async (lookfor: string) => {
    const mQuery = new Map<string, any>([
        ["aim", lookfor],
        ["ignorecase", true],
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/search`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const putApprove = async (name: string, kind: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["kind", kind],
    ]);
    const rt = await fetchNoBody(`api/dictionary/auth/approve`, "PUT", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const delReject = async (name: string, kind: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["kind", kind],
    ]);
    const rt = await fetchNoBody(`api/dictionary/auth/reject`, "DELETE", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const delRemoveItem = async (name: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
    ]);
    const rt = await fetchNoBody(`api/dictionary/auth/item`, "DELETE", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const putSubscribe = async (name: string, kind: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["kind", kind],
    ]);
    const rt = await fetchNoBody(`api/dictionary/auth/subscribe`, "PUT", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getListSubscription = async () => {
    const rt = await fetchNoBody(`api/dictionary/auth/list/subscribe`, "GET", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getSubscriptionStatus = async (name: string) => {
    const mQuery = new Map<string, any>([
        ["name", name]
    ]);
    const rt = (await fetchNoBody(`api/dictionary/auth/check/subscribe`, "GET", mQuery, loginAuth.value)) as any[];
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

////////////////////////////////////////////////////

export const getUserListAll = async (field: string) => {
    const rt = await fetchNoBody(`api/admin/user/list/${field}`, "GET", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getUserListSubscribedAt = async (uname: string) => {
    const mQuery = new Map<string, any>([
        ["uname", uname]
    ]);
    const rt = await fetchNoBody(`api/admin/user/action-list/subscribe`, "GET", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const postSendEmail = async (
    title: string,
    content: string,
    ...recipients: string[]
) => {
    const mForm = new Map<string, any>([
        ["unames", recipients != null ? recipients.join(",") : "recipients-missing-error",],
        ["subject", title],
        ["body", content],
    ]);
    const rt = await fetchBodyForm(`api/admin/email`, "POST", mEmpty, mForm, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

//////////////////////////////////////////////////////////////////////////////////////

// set 'lsEntity', 'lsCollection' here
export const LoadCurrentList = async (kind: string, dbCol: string) => {
    // get list of item
    switch (kind) {
        case "entity":
            {
                const de = await getList(kind, dbCol);
                if (de.error != null) {
                    alert(de.error)
                    break
                }
                lsEntity.value = de.data
            }
            break;

        case "collection":
            {
                const de = await getList(kind, dbCol);
                if (de.error != null) {
                    alert(de.error)
                    break
                }
                lsCollection.value = de.data
            }
            break;
    }

    // get list of subscribed item
    const de = await getListSubscription();
    if (de.error != null) {
        alert(de.error)
        return
    }
    lsSubscribed.value = de.data
};

// set 'selItem', 'aim', 'selType' etc. here etc.
export const Refresh = async (name: any, dbCol: string) => {
    // alert(`into refresh, name is [${name}], dbcol is [${dbCol}]`)

    // set current selected item
    selItem.value = name;

    // selected for searching
    aim.value = name;

    // selected kind
    {
        const de = await getItemKind(name, dbCol);
        if (de.error != null) {
            alert(de.error)
            return
        }
        selType.value = de.data;
    }

    // get content
    {
        const de = await getContent(name, dbCol);
        if (de.error != null) {
            alert(de.error)
            return
        }
        const content = de.data;

        // set content to shared variables
        switch (selType.value) {
            case "entity":
                selEntity.SetContent(content);
                break;

            case "collection":
                selCollection.SetContent(content);

                // get computed collection entities and set them to 'selCollection'
                const de = await getColEntities(name)
                if (de.error != null) {
                    alert(de.error)
                    return
                }
                selCollection.SetEntities(de.data);
                break;
        }
    }

    // get class info
    const de = await getClsInfo(name)
    if (de.error != null) {
        alert(de.error)
        return
    }
    const clsInfo = de.data;
    selClsPath.value = clsInfo.DerivedPath;
    selChildren.value = clsInfo.Children;
};

export const Search = async () => {
    const de = await getSearch(aim.value.trim());
    if (de.error != null) {
        alert(de.error)
        return
    }
    const list = de.data;
    lsEntity.value = list.Entities;
    lsCollection.value = list.Collections;
};

//////////////////////////////////////////////////////////////////////////////////////

export const isSubmitListEmpty = ref(true);

export const UpdateSubmitListStatus = async () => {
    let lsEnt: string | any[];
    let lsCol: string | any[];
    {
        const de = await getList("entity", "text");
        if (de.error != null) {
            alert(de.error)
            return
        }
        lsEnt = de.data;
    }
    {
        const de = await getList("collection", "text");
        if (de.error != null) {
            alert(de.error)
            return
        }
        lsCol = de.data
    }
    isSubmitListEmpty.value = lsEnt.length == 0 && lsCol.length == 0;
};
