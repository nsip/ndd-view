import { fetchNoBody, fetchBodyForm, mEmpty, fetchErr } from "@/share/fetch";
import { entityType } from "@/share/Entity";
import { collectionType } from "@/share/Collection";
import { URL_SIGN } from "./ip";

//////////////////////////////////////////////////////////////////////////////////////

export const loginUser = ref("");
export const loginToken = ref(""); // without 'Bearer '
export const loginAuth = ref(""); // with 'Bearer '
export const loginAsAdmin = ref(false)
export const selMode = ref(''); // 'dictionary' or 'approval', or 'admin'
export const selType = ref(""); // which type of current selection, 'entity' or 'collection'
export const selItem = ref(""); // item name is currently selected
export const selEntity = reactive(new entityType()); // entity content
export const selCollection = reactive(new collectionType()); // collection content
export const aim = ref(""); // what item want to be search
export const lsEnt4Dic = ref([]); // name list of entity in dictionary
export const lsCol4Dic = ref([]); // name list of collection in dictionary
export const lsEnt4Sub = ref([]); // name list of entity in candidates
export const lsCol4Sub = ref([]); // name list of collection in candidates
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

export const getSelfAdminStatus = async () => {
    const rt = await fetchNoBody("api/user/auth/is-admin", "GET", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

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

export const putResetUserPWD = async (uname: string, pwd: string) => {
    const mForm = new Map<string, any>([
        ["uname", uname],
        ["pwd", pwd]
    ]);
    const rt = await fetchBodyForm(`api/admin/user/reset-pwd`, "PUT", mEmpty, mForm, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const getPwdRule = async () => {
    const rt = await fetchNoBody(`/api/user/pub/pwdrule`, "GET", mEmpty, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    }
};

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

export const getItemType = async (name: string, phase: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["phase", phase],
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/type`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getContent = async (name: string, phase: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["phase", phase],
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/one`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const editItemName = async (oldName: string, newName: string, inbound: boolean, type: string) => {
    const mQuery = new Map<string, any>([
        ["old", oldName],
        ["new", newName],
        ["inbound", inbound],
        ["type", type],
    ]);
    const rt = await fetchNoBody(`api/dictionary/auth/update-name`, "PUT", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const getClsInfo = async (name: string) => {
    const mQuery = new Map<string, any>([
        ["name", name]
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/branch`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getList = async (type: string, phase: string) => {
    const mQuery = new Map<string, any>([
        ["phase", phase]
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/list/${type}`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getDump = async (type: string, phase: string) => {
    const mQuery = new Map<string, any>([
        ["phase", phase]
    ]);
    const rt = await fetchNoBody(`api/dictionary/pub/dump/${type}`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

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

export const putApprove = async (name: string, type: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["type", type],
    ]);
    const rt = await fetchNoBody(`api/dictionary/auth/approve`, "PUT", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getItemIsEditable = async (name: string) => {
    const rt = await fetchNoBody(`api/dictionary/pub/is-editable/${name}`, "GET", mEmpty, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const delReject = async (name: string, type: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["type", type],
    ]);
    const rt = await fetchNoBody(`api/dictionary/auth/reject`, "DELETE", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const delRemoveItem = async (name: string) => {
    const rt = await fetchNoBody(`api/dictionary/auth/delete/${name}`, "DELETE", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const putSubscribe = async (name: string, type: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["type", type],
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

// set 'lsEnt4Dic', 'lsCol4Dic' here
export const LoadList4Dic = async (type: string) => {
    // get list of item
    switch (type) {
        case "entity":
            {
                const de = await getList(type, "existing");
                if (de.error != null) {
                    // alert(de.error)
                    console.log(de.error)
                    break
                }
                lsEnt4Dic.value = de.data
            }
            break;

        case "collection":
            {
                const de = await getList(type, "existing");
                if (de.error != null) {
                    // alert(de.error)
                    console.log(de.error)
                    break
                }
                lsCol4Dic.value = de.data
            }
            break;
    }

    // get list of subscribed item
    const de = await getListSubscription();
    if (de.error != null) {
        // alert(de.error)
        console.log(de.error)
        return
    }
    lsSubscribed.value = de.data
};

// set 'lsEnt4Sub', 'lsCol4Sub' here
export const LoadList4Sub = async (type: string) => {
    // get list of item
    switch (type) {
        case "entity":
            {
                const de = await getList(type, "inbound");
                if (de.error != null) {
                    // alert(de.error)
                    console.log(de.error)
                    break
                }
                lsEnt4Sub.value = de.data
            }
            break;

        case "collection":
            {
                const de = await getList(type, "inbound");
                if (de.error != null) {
                    // alert(de.error)
                    console.log(de.error)
                    break
                }
                lsCol4Sub.value = de.data
            }
            break;
    }
};

// use selItem to refresh page content
// so, before invoking Refresh, need "selItem.value = ***"
export const Refresh = async (phase: string) => {

    // selected for searching
    aim.value = selItem.value;

    // selected type
    {
        const de = await getItemType(selItem.value, phase);
        if (de.error != null) {
            // alert(de.error)
            console.log(de.error)
            return
        }
        selType.value = de.data;
    }
    // alert(`into refresh, selType is [${selType.value}]`)

    // get content, here content is json as string
    {
        const de = await getContent(selItem.value, phase);
        if (de.error != null) {
            // alert(de.error)
            console.log(de.error)
            return
        }
        const content = JSON.parse(de.data);

        // console.log(content)

        // clear current selection
        selEntity.Reset()
        selCollection.Reset()

        // set content to shared variables
        switch (selType.value) {
            case "entity":
                selEntity.SetContent(content);
                break;

            case "collection":
                selCollection.SetContent(content);
                break;
        }
    }

    if (phase == "existing") {
        // get class info
        const de = await getClsInfo(selItem.value)
        if (de.error != null) {
            // alert(de.error)
            console.log(de.error)
            return
        }
        const clsInfo = de.data;
        selClsPath.value = clsInfo.DerivedPath;
        selChildren.value = clsInfo.Children;
    }
};

export const Search = async () => {
    const de = await getSearch(aim.value.trim());
    if (de.error != null) {
        // alert(de.error)
        console.log(de.error)
        return
    }
    const list = de.data;
    lsEnt4Dic.value = list.Entities;
    lsCol4Dic.value = list.Collections;
};

//////////////////////////////////////////////////////////////////////////////////////

export const hasSubmission = async () => {
    await LoadList4Sub("entity");
    await LoadList4Sub("collection");
    return lsEnt4Sub.value.length > 0 || lsCol4Sub.value.length > 0
}
