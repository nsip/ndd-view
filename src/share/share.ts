import { fetchNoBody, fetchBodyForm, mEmpty, fetchErr } from "@/share/fetch";
import { entityType } from "@/share/Entity";
import { collectionType } from "@/share/Collection";
import { URL_ISSO, URL_SIGN } from "./ip";
import eventBus from "./util";

//////////////////////////////////////////////////////////////////////////////////////

export const loginUser = ref('');
export const loginToken = ref(''); // without 'Bearer '
export const loginAuth = ref(''); // with 'Bearer '
export const loginAsAdmin = ref(false)
export const selMode = ref(''); // 'Dictionary' or 'Approval', or 'Admin'
export const selCat = ref(''); // which category of current selection, 'entity' or 'collection'
export const selType = ref(''); // type: 'abstract', 'element', 'object', or 'collection'
export const selItem = ref(''); // item name is currently selected
export const selEntity = reactive(new entityType()); // entity content
export const selCollection = reactive(new collectionType()); // collection content
export const mItemMType = ref<Map<string, any>>(); // entity name: ['abstract', 'element', 'object']
export const aim = ref(''); // what item want to be search
export const lsEnt4Dic = ref<string[]>([]); // name list of entity in dictionary
export const lsCol4Dic = ref<string[]>([]); // name list of collection in dictionary
export const lsEnt4Submit = ref<string[]>([]); // name list of entity in candidates
export const lsCol4Submit = ref<string[]>([]); // name list of collection in candidates
export const selClsPath = ref([]); // current selected item's class path
export const selChildren = ref([]); // current selected item's children
export const lsSubscribed = ref([]); // subscribed item name list
export const hasPending = ref(false);
export const globalMsg = ref(''); // global message
export const dataIssoId = ref('');
export const dataIssoTitle = ref('');

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

// export const getFile = async (url: string) => {
//     const rt = await fetchNoBody(url, "GET", mEmpty, "");
//     const err = await fetchErr(rt, onExpired)
//     return {
//         'data': err == null ? (rt as any[])[0] : null,
//         'error': err
//     };
// };

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

export const getFileText = async (file: string) => {
    const mQuery = new Map<string, any>([
        ["file", file],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/file-text`, "GET", mQuery, loginAuth.value, false); // response as text, not json
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const getAttributes = async (name: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/attributes`, "GET", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const getReferences = async (name: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/bi-references`, "GET", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const getCategory = async (name: string, phase: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["phase", phase],
    ]);
    const rt = await fetchNoBody(`api/dic/pub/category`, "GET", mQuery, "");
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
    const rt = await fetchNoBody(`api/dic/pub/one`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getAllEntityType = async () => {
    const rt = await fetchNoBody(`api/dic/pub/all-entity-type`, "GET", mEmpty, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const putEditItemName = async (oldName: string, newName: string, inbound: boolean, cat: string) => {
    const mQuery = new Map<string, any>([
        ["old", oldName],
        ["new", newName],
        ['inbound', inbound],
        ["cat", cat],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/update-name`, "PUT", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const patchValidation = async (msg: string) => {
    const mQuery = new Map<string, any>([
        ["msg", msg],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/validate`, "PATCH", mQuery, loginAuth.value, false);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const patchReCom = async (msg: string) => {
    const mQuery = new Map<string, any>([
        ["msg", msg],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/restructure`, "PATCH", mQuery, loginAuth.value);
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
    const rt = await fetchNoBody(`api/dic/pub/branch`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getList = async (cat: string, phase: string) => {
    const mQuery = new Map<string, any>([
        ["phase", phase]
    ]);
    const rt = await fetchNoBody(`api/dic/pub/list/${cat}`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getDumpJSON = async (cat: string) => {
    const rt = await fetchNoBody(`api/dic/pub/dump/${cat}`, "GET", mEmpty, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const getDumpCSV = async () => {
    const rt = await fetchNoBody(`api/dic/pub/export/csv`, "GET", mEmpty, "");
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
    const rt = await fetchNoBody(`api/dic/pub/search`, "GET", mQuery, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const putApprove = async (name: string, cat: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["cat", cat],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/approve`, "PUT", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getItemIsEditable = async (name: string) => {
    const rt = await fetchNoBody(`api/dic/pub/is-editable/${name}`, "GET", mEmpty, "");
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const getPeekID = async (name: string) => {
    const rt = await fetchNoBody(`api/dic/auth/peek-id/${name}`, "GET", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const delReject = async (name: string, cat: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["cat", cat],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/reject`, "DELETE", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const delRemoveItem = async (name: string) => {
    const rt = await fetchNoBody(`api/dic/auth/delete/${name}`, "DELETE", mEmpty, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

export const putSubscribe = async (name: string, cat: string) => {
    const mQuery = new Map<string, any>([
        ["name", name],
        ["cat", cat],
    ]);
    const rt = await fetchNoBody(`api/dic/auth/subscribe`, "PUT", mQuery, loginAuth.value);
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
};

export const getListSubscription = async () => {
    const rt = await fetchNoBody(`api/dic/auth/list/subscribe`, "GET", mEmpty, loginAuth.value);
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
    const rt = (await fetchNoBody(`api/dic/auth/check/subscribe`, "GET", mQuery, loginAuth.value)) as any[];
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

export const postUpload2Recover = async (file: File) => {
    const mForm = new Map<string, any>([
        ["file", file],
    ]);
    const rt = await fetchBodyForm(`/api/admin/upload-dic-formfile`, `POST`, mEmpty, mForm, loginAuth.value)
    const err = await fetchErr(rt, onExpired)
    return {
        'data': err == null ? (rt as any[])[0] : null,
        'error': err
    };
}

//////////////////////////////////////////////////////////////////////////////////////

// set 'lsEnt4Dic', 'lsCol4Dic' here
export const LoadList4Dic = async (cat: string) => {

    // get list of item
    switch (cat) {
        case 'entity':
            {
                const de = await getList(cat, 'existing');
                if (de.error != null) {
                    // alert(de.error)
                    console.log(de.error)
                    break
                }
                lsEnt4Dic.value = de.data
            }
            break;

        case 'collection':
            {
                const de = await getList(cat, 'existing');
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

// set 'lsEnt4Submit', 'lsCol4Submit' here
export const LoadList4Sub = async (cat: string) => {

    // get list of item
    switch (cat) {
        case 'entity':
            {
                const de = await getList(cat, 'inbound');
                if (de.error != null) {
                    // alert(de.error)
                    console.log(de.error)
                    break
                }
                lsEnt4Submit.value = de.data
            }
            break;

        case 'collection':
            {
                const de = await getList(cat, 'inbound');
                if (de.error != null) {
                    // alert(de.error)
                    console.log(de.error)
                    break
                }
                lsCol4Submit.value = de.data
            }
            break;
    }
};

// use SetSelItem to set page content
// so, before invoking Refresh, need "SetSelItem(***)"
export const Refresh = async (phase: string) => {

    // selected for searching
    aim.value = selItem.value;


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
        switch (selCat.value) {
            case 'entity':
                selEntity.SetContent(content);
                break;

            case 'collection':
                selCollection.SetContent(content);
                break;
        }
    }

    // reset scroll position
    ["ent-content", "col-content"].forEach((id) => {
        const content = document.getElementById(id) as HTMLElement;
        content.scrollTop = 0;
    })

    // update class path
    if (phase == 'existing') {
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

export const IsItemEditable = async (item: string) => {
    const de = await getItemIsEditable(item);
    if (de.error != null) {
        console.log(de.error)
        return false
    }
    return de.data
}

export const PeekID = async (item: string) => {
    const de = await getPeekID(item);
    if (de.error != null) {
        console.log(de.error)
        return ""
    }
    return de.data
}

//////////////////////////////////////////////////////////////////////////////////////

export const UpdatePendingStatus = async () => {
    await LoadList4Sub('entity');
    await LoadList4Sub('collection');
    hasPending.value = lsEnt4Submit.value.length > 0 || lsCol4Submit.value.length > 0
    if (!hasPending.value) {
        eventBus.emit('default-tab', 'from UpdatePendingStatus');
    }
}

export const Attributes = async () => {
    return (await getAttributes(selItem.value)).data as string[]
}

export const References = async () => {
    return (await getReferences(selItem.value)).data as string[]
}

export const FileText = async (file: string) => {
    return (await getFileText(file)).data as string
}

export const SetSelItem = async (item: string, phase: string) => {
    // set selected item
    const regex = /\(\d+\)$/;
    selItem.value = item.replace(regex, '');

    // also update selected category from backend api
    const de = await getCategory(selItem.value, phase);
    if (de.error == null) {
        if (mItemMType.value?.size == 0) {
            const m = await getAllEntityType()
            mItemMType.value = new Map(Object.entries(m.data))
        }
        const t = mItemMType.value?.get(selItem.value)
        SetSelCatType(de.data, t == undefined ? 'collection' : t) // also set selected item's cat & type
    }
}

// only for tab clicking
export const SetSelCatType = (cat: string, type: string) => {

    switch (cat) {
        case 'entity':
            switch (type) {
                case 'abstract':
                case 'Abstract':
                case 'element':
                case 'Element':
                case 'object':
                case 'Object':
                    selType.value = type.toLowerCase();
                    break
                default:
                    alert(`entity's (type) can only be one of[abstract, element, object], ignore '${type}'`)
                    return
            }
            break

        case 'collection':
            selType.value = 'collection'
            break

        default:
            alert(`(cat) can only be one of[entity, collection], ignore '${cat}'`)
            return
    }

    selCat.value = cat

    eventBus.emit('SetSelCatType', `${cat}-${type}`); // notify ListItem.vue to change tab
}

export const ModeOnDictionary = () => {
    return selMode.value == 'Dictionary'
}

export const ModeOnApproval = () => {
    return selMode.value == 'Approval'
}

export const ModeOnAdmin = () => {
    return selMode.value == 'Admin'
}

export const ModeOnMaintain = () => {
    return selMode.value == 'Maintain'
}

export const CatOnEntity = () => {
    return selCat.value == 'entity'
}

export const CatOnCollection = () => {
    return selCat.value == 'collection'
}

//////////////////////////////////////////////////////////////

export const UpdateIssoLoading = () => {
    document.head.removeAttribute("script");
    const issoScript = document.createElement("script");
    issoScript.setAttribute(
        "src",
        `${URL_ISSO}/js/embed.min.js`
    );
    issoScript.setAttribute(
        "data-isso",
        `${URL_ISSO}`
    );
    document.head.appendChild(issoScript);

    // hide 'isso-thread-heading'
    const issoHeaders = document.getElementsByClassName('isso-thread-heading');
    for (let i = 0; i < issoHeaders.length; i++) {
        (issoHeaders[i] as HTMLElement).style.display = 'none';
    }
}