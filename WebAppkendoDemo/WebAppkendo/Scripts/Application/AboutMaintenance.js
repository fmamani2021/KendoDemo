function AboutMaintenance(config) {
    this.searchUrl = config.searchUrl;
    this.findUrl = config.findUrl;
    this.createUrl = config.createUrl;
    this.updateUrl = config.updateUrl;
    this.deleteUrl = config.deleteUrl;
    this.countriesUrl = config.countriesUrl;
    this.newPersonModel = config.newPersonModel;
    this.listRoles = config.listRoles;    
}

AboutMaintenance.prototype = {
    onReady: function () {
        let self = this;
        let viewModel = new kendo.observable({
            person: { ...self.newPersonModel },
            rol: {
                dataSource: self.listRoles,
                onClose: function () {
                    console.log("close dropdownlist rol");
                }
            },
            country: {
                selectedModel: null,
                dataSource: SourceAutocomplete(self.countriesUrl, { id: 1, nombre: 'juan' }),
                onChange: function (event, countryModel) {
                    if (event && event.preventDefault)
                        event.preventDefault();

                    if (viewModel.country.selectedModel && viewModel.country.selectedModel.Id) {
                        viewModel.person.set("CountryId", viewModel.country.selectedModel.Id);
                        return;
                    }
                    viewModel.person.set("CountryId", null);
                    viewModel.country.set('selectedModel', null);
                },
                isEnabled: function () {
                    return viewModel.person.get("Name").length > 0;
                }
            },
            expiredate: {
                isVisible: function () {
                    return viewModel.person.get("LastName").length > 0;
                },
                onChange: function () {
                    console.log("onChange expiredate");
                }
            },
            grid: {
                modelSchema: {
                    fields: {
                        Name: { type: 'string' },
                        LastName: { type: 'string' },
                        Active: { type: "boolean" },
                        ExpireDate: { type: 'Date' },
                        CreatedDate: { type: 'Date' }
                    }
                },
                dataSource: new kendo.data.DataSource({
                    data: [],
                    pageSize: 10
                }),
                onSearch: function (event) {
                    if (event && event.preventDefault)
                        event.preventDefault();

                    //var searchData = JSON.stringify(self.viewModel.person);
                    var newDS = SetGridDataSourceAsync(self.searchUrl,
                        null,
                        viewModel.grid.modelSchema.toJSON(),
                        true,
                        null,
                        null,
                        null,
                        viewModel.grid.onCompleteSearch()
                    );
                    viewModel.grid.set("dataSource", newDS);
                    viewModel.grid.dataSource.page(1);
                    viewModel.actions.onClean();
                },
                onCompleteSearch: function () {
                    return function (data, status) {
                        switch (status) {
                            case 'success':

                                break;
                            case 'parsererror':
                            case 'error':
                                alertify.error("Internal Server error in Search");
                                break;
                            case 'timeout':
                                alertify.error("Timeout error in Search");
                                break;
                        }
                    };
                },
                onClean() {
                    viewModel.grid.set('dataSource', new kendo.data.DataSource({
                        data: [],
                        pageSize: 10
                    }));
                    viewModel.grid.dataSource.page(1);
                },
                gridDataBound: function () {
                    console.log("gridDataBound");
                }
            },
            actions: {
                onNew: function () {
                    viewModel.actions.onClean();
                },
                onCreate: function () {
                    var req = AjaxParamsActionPostPromiseAsync(self.createUrl, viewModel.person, null);
                    req.done(function (response) {
                        alertify.success("Record was saved successfully.");
                        viewModel.grid.onSearch();
                    }).fail(viewModel.actions.transacionalServiceErrorCallback);
                },
                onEdit: function () {
                    var req = AjaxParamsActionPostPromiseAsync(self.updateUrl, viewModel.person, null);
                    req.done(function (response) {
                        alertify.success("Record was updated successfully.");
                        viewModel.grid.onSearch();
                    }).fail(viewModel.actions.transacionalServiceErrorCallback);
                },
                onDelete: function (model) {
                    if (event && event.preventDefault)
                        event.preventDefault();

                    var UUId = model.data.UUId;

                    alertify.confirm("Are you sure to delete the record?", function (e) {
                        if (e) {
                            var req = AjaxParamsActionPostPromiseAsync(self.deleteUrl, { uuid: UUId }, null);
                            req.done(function (response) {
                                alertify.success("The record was deleted successfully.");
                                viewModel.grid.onSearch();
                            }).fail(viewModel.actions.transacionalServiceErrorCallback);
                        }
                    });
                },
                transacionalServiceErrorCallback: function (error, textStatus, errorThrown) {

                    if (error.responseJSON && error.responseJSON.Messages && error.responseJSON.Messages.length) {
                        error.responseJSON.Messages.forEach(function (item, index, array) {
                            alertify.error(item.Message);
                        });
                        return;
                    }
                    if (error.responseText) {
                        var responseDto = JSON.parse(error.responseText)
                        if (responseDto && responseDto.Messages && responseDto.Messages.length) {
                            responseDto.Messages.forEach(function (item, index, array) {
                                alertify.error(item.Message);
                            });
                        }
                        return;
                    }

                    alertify.error("An internal server error occurred.");
                },
                onClean: function () {
                    if (event && event.preventDefault)
                        event.preventDefault();

                    viewModel.set('person', { ...self.newPersonModel });
                    viewModel.country.set('selectedModel', null);
                },
                onEditSelected: function (model) {
                    var uri = `${self.findUrl}?uuid=${model.data.UUId}`;
                    var req = AjaxParamsActionGetPromiseAsync(uri);
                    req.done(function (response) {
                        viewModel.set('person', { ...response });
                        const { CountryId, CountryDescription } = response;
                        viewModel.country.set('selectedModel', { Id: CountryId, Description: CountryDescription });
                    })
                        .fail(function (error) {
                            if (error.statusText) {
                                var responseDto = JSON.parse(error.statusText)
                                if (responseDto && responseDto.Messages && responseDto.Messages.length) {
                                    responseDto.Messages.forEach(function (item, index, array) {
                                        alertify.error(item.Message);
                                    });
                                }
                                return;
                            }
                            alertify.error("An internal server error occurred.");
                        });
                }
            }
        });
        kendo.bind($("#view_about"), viewModel);
    }
}