function clear(context, timerId) {
    context.isLoading = false;
    clearTimeout(timerId);
}

export function setButtonInvokeTimeout(duration, context) {
    let timerId = setTimeout(() => clear(context, timerId), duration);
}