let timerId = null;

function clear(context) {
    context.isLoading = false;
    clearTimeout(timerId);
}

export function setButtonInvokeTimeout(duration, context) {
    timerId = setTimeout(() => clear(context), duration);
}