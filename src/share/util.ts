import mitt from "mitt"
const eventBus = mitt();
export default eventBus;

export const space4html = (n: number) => {
    let rt = ""
    for (let i = 0; i < n; i++) {
        rt += "&nbsp;"
    }
    return rt
}

export const isEmpty = (val: any) => {
    if (val == undefined) {
        return true;
    }
    if (val == null) {
        return true;
    }
    if (Array.isArray(val)) {
        return val.length == 0;
    }
    if (typeof val === "string") {
        return val.length == 0;
    }
    if (typeof val === "object") {
        if (Object.keys(val).length === 0) {
            return true;
        }
        for (const k in val) {
            if (!isEmpty(val[k])) {
                return false;
            }
        }
        return true;
    }
    return false;
};

export const isNotEmpty = (val: any) => {
    return !isEmpty(val);
};

export const linkify = (s: any, lf: boolean) => {
    if (Array.isArray(s)) {
        const ret: string[] = [];
        for (let i = 0; i < s.length; i++) {
            let linkstr = `<a href="${s[i]}">${s[i]}</a>`;
            if (lf) {
                linkstr += "<br>";
            }
            ret.push(linkstr);
        }
        return ret;
    } else if (typeof s === "string") {
        let linkstr = `<a href="${s}">${s}</a>`;
        if (lf) {
            linkstr += "<br>";
        }
        return linkstr;
    }
};

export const offsetCSS = (sz: string, offset: number) => {
    if (sz.endsWith('cm') ||
        sz.endsWith('mm') ||
        sz.endsWith('in') ||
        sz.endsWith('px') ||
        sz.endsWith('pt') ||
        sz.endsWith('pc') ||
        sz.endsWith('em') ||
        sz.endsWith('ex') ||
        sz.endsWith('ch') ||
        sz.endsWith('vw') ||
        sz.endsWith('vh')
    ) {
        const tail = sz.slice(sz.length - 2, sz.length);
        const strNum = sz.slice(0, -2);
        return parseFloat(strNum) + offset + tail
    }

    if (sz.endsWith('rem') || sz.endsWith('vmin') || sz.endsWith('vmax')) {
        const tail = sz.slice(sz.length - 3, sz.length);
        const strNum = sz.slice(0, -3);
        return parseFloat(strNum) + offset + tail
    }

    if (sz.endsWith('%')) {
        const tail = sz.slice(sz.length - 1, sz.length);
        const strNum = sz.slice(0, -1);
        return parseFloat(strNum) + offset + tail
    }

    return sz
}

export const download_file = (url: string, file_name: string) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = file_name;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
}