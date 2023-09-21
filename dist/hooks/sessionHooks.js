export async function sessionHooks({ event }) {
    event.request.setSessionItem = (itemKey, itemValue) => {
        event.cookies.set(`kinde_${itemKey}`, typeof itemValue === 'string' ? itemValue : JSON.stringify(itemValue), {
            path: '/'
        });
    };
    event.request.getSessionItem = (itemKey) => {
        const item = event.cookies.get(`kinde_${itemKey}`) || '';
        if (/state/.test(itemKey)) {
            return item; // return raw state
        }
        try {
            const result = JSON.parse(item);
            return result;
        }
        catch (error) {
            return event.cookies.get(`kinde_${itemKey}`);
        }
    };
    event.request.removeSessionItem = (itemKey) => {
        return event.cookies.delete(`kinde_${itemKey}`, {
            path: '/'
        });
    };
    event.request.destroySession = async () => {
        event.cookies.getAll().forEach((item) => {
            if (/^kinde_/.test(item.name)) {
                event.cookies.delete(item.name, { path: '/' });
            }
        });
        return;
    };
}
