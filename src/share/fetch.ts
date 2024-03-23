import { URL_API } from "@/share/ip";

const ip = URL_API + "/";

export const mEmpty = new Map<string, any>();

export const fetchErr = async (rt: any, onExpired: any) => {
    if (rt.error !== undefined && rt.error != null && rt.error.length > 0) {
        return rt.error
    }
    const val = rt as any[];
    const err = val[1] != 200 ? val[0] : null
    if (err != null && (err as string).includes("invalid or expired jwt")) { // this message refers to API server
        onExpired()
    }
    return err
}

export const fetchBodyForm = async (
    path: string,
    method: string,
    mQuery: Map<string, any>,
    mForm: Map<string, any>,
    auth: string,
    respAsJson: boolean = true,
) => {
    let url = ip + path.replace(/^\/+/, "");
    let payload: any;

    if (mQuery.size > 0) {
        const qryParams = new URLSearchParams();
        mQuery.forEach((v, k) => {
            qryParams.append(k, v);
        });
        url += "?" + qryParams;
    }

    if (mForm.size > 0) {
        const formData = new FormData();
        mForm.forEach((v, k) => {
            formData.append(k, v);
        });
        payload = formData;
    }

    try {
        const headers = {
            'Accept': "application/json",
            'Authorization': auth,
        };
        const resp = await fetch(url, {
            method: method,
            headers: headers,
            body: payload,
            mode: "cors",
        });

        if (!resp.ok) {
            const text = await resp.text();
            return new Promise((resolve, reject) => {
                // alert('Failed to fetch, got status ' + resp.status + ' @ ' + text)
                resolve([text, resp.status]);
            });
        }

        const respData = await (respAsJson ? resp.json() : resp.text());
        return new Promise((resolve, reject) => {
            resolve([respData, resp.status]);
        });

    } catch (e) {
        return {
            'error': e + "\nnetwork or response-parsing error: " + url
        }
    }
};

// const mForm = new Map<string, any>()
// mForm.set("database", "myDb")
// mForm.set('collection', "myCol")
// let rt = await fetchBodyForm("api/entity/db", "PUT", mEmpty, mForm, "")
// console.log(rt)

export const fetchBodyJsonStr = async (
    path: string,
    method: string,
    mQuery: Map<string, any>,
    payload: string,
    auth: string,
    respAsJson: boolean = true
) => {
    let url = ip + path.replace(/^\/+/, "");

    if (mQuery.size > 0) {
        const qryParams = new URLSearchParams();
        mQuery.forEach((v, k) => {
            qryParams.append(k, v);
        });
        url += "?" + qryParams;
    }

    try {
        const headers = {
            'Accept': "application/json",
            'Authorization': auth,
            'Content-Type': "application/json",
        };
        const resp = await fetch(url, {
            method: method,
            headers: headers,
            body: payload,
            mode: "cors",
        });

        if (!resp.ok) {
            const text = await resp.text();
            return new Promise((resolve, reject) => {
                // alert('Failed to fetch, got status ' + resp.status + ' @ ' + text)
                resolve([text, resp.status]);
            });
        }

        const respData = await (respAsJson ? resp.json() : resp.text());
        return new Promise((resolve, reject) => {
            resolve([respData, resp.status]);
        });

    } catch (e) {
        return {
            'error': e + "\nnetwork or response-parsing error: " + url
        }
    }
};

export const fetchBodyObject = async (
    path: string,
    method: string,
    mQuery: Map<string, any>,
    body: any,
    auth: string,
    respAsJson: boolean = true
) => {
    let url = ip + path.replace(/^\/+/, "");
    let payload: any;

    if (mQuery.size > 0) {
        const qryParams = new URLSearchParams();
        mQuery.forEach((v, k) => {
            qryParams.append(k, v);
        });
        url += "?" + qryParams;
    }

    if (body != undefined && body != null) {
        const jsonBody = JSON.stringify(body);
        if (jsonBody.length > 0) {
            payload = jsonBody;
        }
    }

    try {
        const headers = {
            'Accept': "application/json",
            'Authorization': auth,
            'Content-Type': "application/json",
        };
        const resp = await fetch(url, {
            method: method,
            headers: headers,
            body: payload,
            mode: "cors",
        });

        if (!resp.ok) {
            const text = await resp.text();
            return new Promise((resolve, reject) => {
                // alert('Failed to fetch, got status ' + resp.status + ' @ ' + text)
                resolve([text, resp.status]);
            });
        }

        const respData = await (respAsJson ? resp.json() : resp.text());
        return new Promise((resolve, reject) => {
            resolve([respData, resp.status]);
        });

    } catch (e) {
        return {
            'error': e + "\nnetwork or response-parsing error: " + url
        }
    }
};

export const fetchNoBody = async (
    path: string,
    method: string,
    mQuery: Map<string, any>,
    auth: string,
    respAsJson: boolean = true,
) => {

    // let url = path.includes(ip) ? path : ip + path.replace(/^\/+/, "");
    let url = ip + path.replace(/^\/+/, "");

    if (mQuery.size > 0) {
        const qryParams = new URLSearchParams();
        mQuery.forEach((v, k) => {
            qryParams.append(k, v);
        });
        url += "?" + qryParams;
    }

    try {
        const headers = {
            'Accept': "application/json",
            'Authorization': auth,
        };
        const resp = await fetch(url, {
            method: method,
            headers: headers,
            mode: "cors",
        });

        if (!resp.ok) {
            const text = await resp.text();
            return new Promise((resolve, reject) => {
                // alert('Failed to fetch, got status ' + resp.status + ' @ ' + text)
                resolve([text, resp.status]);
            });
        }

        const respData = await (respAsJson ? resp.json() : resp.text());
        return new Promise((resolve, reject) => {
            resolve([respData, resp.status]);
        });

    } catch (e) {
        return {
            'error': e + "\nnetwork or response-parsing error: " + url
        }
    }
};

// (async () => {
//     try {
//         const itemType = 'entity'
//         const rt = (await fetchNoBody(`api/dictionary/pub/list/${itemType}`, "GET", mEmpty, "")) as any[]
//         if (rt[1] != 200) {
//             alert(rt[0])
//             return
//         }
//         console.log(rt[0])
//     } catch (err) {
//         console.log(err)
//     }
// })()

// (async () => {
//     try {
//         const mParam: Map<string, any> = new Map<string, any>([
//             ["name", 'School']
//         ])
//         const rt = await fetchNoBody(`api/dictionary/pub/one`, "GET", mParam) as any[]
//         if (rt[1] != 200) {
//             alert(rt[0])
//             return
//         }
//         console.log(rt[0])
//     } catch (err) {
//         console.log(err)
//     }
// })()
