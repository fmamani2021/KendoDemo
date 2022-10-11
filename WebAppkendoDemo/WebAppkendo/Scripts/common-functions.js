function SourceAutocomplete(url, filter) {
    var FilterSource = new kendo.data.DataSource({
        suggest: true,
        serverFiltering: true,
        serverPaging: true,
        pageSize: 100,
        transport: {
            type: "json",
            read: url,
            cache: false,
            parameterMap: function (data, type) {
                if (data.filter != null) {
                    if (data.filter.filters != null && data.filter.filters.length > 0) {
                        if (filter)
                            filter.criteria = data.filter.filters[0].value;
                        else {
                            filter = { criteria: data.filter.filters[0].value };
                        }
                    }
                }
                return filter;
            }
        }
    });
    return FilterSource;
}

function SetGridDataSourceAsync(
    url,
    criteria,
    modelSchema,
    serverPaging,
    requestStartCallback,
    requestEndCallback,
    changeCallback,
    completeCallback,
    pageSize) {
    var ds = new kendo.data.DataSource({
        transport: {
            read: {
                url: url,
                type: "POST",
                contentType: "application/json; charset=utf-8",
                complete: function (data, status) {
                    if (completeCallback)
                        completeCallback(data, status);
                }
            },
            parameterMap: function (options) {
                var filter = Object.assign({ parameters: options }, criteria);
                return JSON.stringify(filter);
            }
        },
        schema: { data: "data", total: "total", model: modelSchema },
        pageSize: pageSize ? pageSize : 10,
        serverPaging: serverPaging,
        requestStart: function (e) {
            if (requestStartCallback)
                requestStartCallback(e);
        },
        requestEnd: function (e) {
            if (requestEndCallback)
                requestEndCallback(e);
        },
        change: function (data) {
            if (changeCallback)
                changeCallback(data);
        }
    });
    return ds;
}

function AjaxParamsActionPostPromiseAsync(url, params, beforeSendCallback, async) {
    return $.ajax({
        type: "POST",
        url: url,
        contentType: 'application/json',
        data: JSON.stringify(params),
        async: !async,
        beforeSend: beforeSendCallback
    });
}

function AjaxParamsActionGetPromiseAsync(url, beforeSendCallback, async) {
    return $.ajax({
        type: "GET",
        url: url,
        contentType: 'application/json',
        async: !async,
        beforeSend: beforeSendCallback
    });
}


